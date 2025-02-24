from fastapi import FastAPI, HTTPException,Depends,File, UploadFile
from typing import List
from typing_extensions import Annotated
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session
models.Base.metadata.create_all(bind=engine)
from requestmodels import RegisterBase, LoginBase,StudentSearch,requestNewComment, changeNewPassword
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from datetime import datetime

app = FastAPI()
origins = [
    "http://localhost:3000",  
    "http://localhost:3001",
    "http://localhost:8080",  
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],   
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]   

@app.post("/user/register")
async def create_users(user: RegisterBase, db: db_dependency):
    if user.role == 1:
        df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/static_data/students_list.xlsx', engine='openpyxl')
        filtered_df = df[df['Email'] == user.email]
        if not filtered_df.empty:
            name = filtered_df['studentname'].iloc[0]
        else:
            raise HTTPException(status_code= 400, detail="Bạn không có trong danh sách sinh viên kỳ này!!!")
    else:
        df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/static_data/teachers_list.xlsx', engine='openpyxl')
        filtered_df = df[df['Email'] == user.email]
        if not filtered_df.empty:
            name = filtered_df['Teacher_name'].iloc[0]
        else:
            raise HTTPException(status_code= 400, detail="Bạn không có trong danh sách giảng viên kỳ này!!!")
    isExist = db.query(models.Users).filter(models.Users.email == user.email).first()
    if not isExist:
        db_user = models.Users(username = name,email = user.email, password = user.password, role = user.role)
        db.add(db_user)
        db.commit()
        response = {
            'status': 'Tạo tài khoản thành công'
        }
        return response
    else:
        raise HTTPException(status_code= 400, detail="Tài khoản đã tồn tại")

@app.post('/user/changepw')
async def change_pw(user:changeNewPassword,db:db_dependency):
    result = db.query(models.Users).filter(models.Users.email == user.email).first()
    if not result:
        raise HTTPException(status_code=403, detail="Tài khoản không tồn tại")
    else:
        if result.password == user.current_password:
            result.password = user.new_password
            db.commit()
            reponse = {'message':'Đổi mật khẩu thành công',}
            return reponse
        else:
            raise HTTPException(status_code= 404, detail="Tài khoản hoặc mật khẩu không đúng!!!")

@app.post("/user/login")
async def user_login(user: LoginBase, db: db_dependency):
    result = db.query(models.Users).filter(models.Users.email == user.email).first()
    if not result:
        raise HTTPException(status_code= 404, detail="Tài khoản hoặc mật khẩu không đúng!!!")
    else:
        if result.password == user.password:
            reponse = {'message':'Đăng nhập thành công', 'info': result}
            return reponse
        else:
            raise HTTPException(status_code= 404, detail="Tài khoản hoặc mật khẩu không đúng!!!")
        

@app.get("/user/myreport/{email}")
async def get_my_report(email:str, db: db_dependency):
    result = db.query(models.Users).filter(models.Users.email == email).first()
    if not result:
        raise HTTPException(status_code= 404, detail="Người dùng này không tồn tại")
    else:
        if result.role == 1:
            df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/end_report_data.xlsx', engine='openpyxl')
            filtered_df = df[df['Email'] == result.email]
            problem_array = filtered_df.to_dict('records')

            manager_df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/manager_report_data.xlsx', engine='openpyxl')
            filtered_df = manager_df[manager_df['Email'] == result.email]
            total_array = filtered_df.to_dict('records')
            number_of_rows = manager_df.shape[0]
            return {
                'problem': problem_array,
                'total':total_array,
                'number_student': number_of_rows,
            }
        if result.role == 2:
            df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/end_report_data.xlsx', engine='openpyxl')
            filtered_df = df[df['GVHD'] == result.username]
            problem_array = filtered_df.to_dict('records')
            stu_email = filtered_df['Email'].drop_duplicates().to_list()
            report = []
            for email in stu_email:
                stu_df = filtered_df[filtered_df['Email']== email]
                std_data = stu_df.to_dict('records')
                report.append(std_data)
            return {
                'report': report,
                'student': stu_email
            }
        if result.role == 3:
            problem_df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/problem_report_data.xlsx', engine='openpyxl')
            problem_array = problem_df.to_dict('records')
            
            stu_df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/manager_report_data.xlsx', engine='openpyxl')
            stu_df['%Point'] = (stu_df['Total_Point'] / stu_df['Total_Max_Point']) * 100
            point_array = stu_df['%Point'].to_list()

            teacher_df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/teacher_report_data.xlsx', engine='openpyxl')
            teacher_array = teacher_df.to_dict('records')
            return {
                'problem': problem_array,
                'point': point_array,
                'teacher': teacher_array
            }

@app.get("/user/student/{email}")
async def get_student_report(email:str):
    df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/end_report_data.xlsx', engine='openpyxl')
    filtered_df = df[df['Email'] == email]
    problem_array = filtered_df.to_dict('records')

    manager_df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/manager_report_data.xlsx', engine='openpyxl')
    filtered_df = manager_df[manager_df['Email'] == email]
    total_array = filtered_df.to_dict('records')
    number_of_rows = manager_df.shape[0]
    return {
        'problem': problem_array,
        'total':total_array,
        'number_student': number_of_rows,
    }


@app.post("/student/list/")
async def get_student_list(request: StudentSearch):
    page = request.page
    searchtext = request.emailSearch
    df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/static_data/students_list.xlsx', engine='openpyxl')
    df = df[df['Email'].str.startswith(searchtext)]
    start = page*20
    end = (page+1)*20
    len = df.shape[0]
    if(end >= len):
        first_20_rows = df.iloc[start:]
    else:
        first_20_rows = df.iloc[start:end]
    stu_arr = first_20_rows.to_dict('records')
    return {
        'student': stu_arr,
        'number_student': len
    }
@app.post("/teacher/list/")
async def get_student_list(request: StudentSearch):
    page = request.page
    searchtext = request.emailSearch
    df = pd.read_excel('/Users/vvits/airflow/dags/project1_analyze_data/static_data/teachers_list.xlsx', engine='openpyxl')
    df = df[df['Email'].str.startswith(searchtext)]
    start = page*20
    end = (page+1)*20
    len = df.shape[0]
    if(end >= len):
        first_20_rows = df.iloc[start:]
    else:
        first_20_rows = df.iloc[start:end]
    stu_arr = first_20_rows.to_dict('records')
    return {
        'teacher': stu_arr,
        'number_teacher': len
    }             
@app.get("/comment/{owner_email}")
async def get_comment_list(owner_email: str, db: db_dependency ):
    result = db.query(models.Comments).filter(models.Comments.owner_email == owner_email).all()
    return {
        'comment_list': result
    }

@app.post("/comment/create_new_comment")
async def get_comment_list(comment: requestNewComment, db: db_dependency ):
    
    db_user = models.Comments(comment_text=comment.comment_text,owner_email = comment.owner_email, send_email = comment.send_email, create_at=datetime.now())
    db.add(db_user)
    db.commit()
    response = {
        'status': 'Tạo comment mới thành công!'
    }
    return response

@app.post("/term_setting/student")
async def update_term_student(file: UploadFile = File(...)):
    file_location = f"/Users/vvits/airflow/dags/project1_analyze_data/static_data/students_list.xlsx"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    response = {
        'status': 'Cập nhật thành công mới thành công!'
    }
    return response

@app.post("/term_setting/teacher")
async def update_term_teacher(file: UploadFile = File(...)):
    file_location = f"/Users/vvits/airflow/dags/project1_analyze_data/static_data/teachers_list.xlsx"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    response = {
        'status': 'Cập nhật thành công mới thành công!'
    }
    return response

@app.post("/term_setting/problem/")
async def update_term_problem(file: UploadFile = File(...)):
    file_location = f"/Users/vvits/airflow/dags/project1_analyze_data/static_data/problem_list.xlsx"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    response = {
        'status': 'Cập nhật thành công mới thành công!'
    }
    return response



