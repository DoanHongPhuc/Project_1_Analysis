from pydantic import BaseModel

class RegisterBase(BaseModel):
    email: str
    password: str
    role: int

class LoginBase(BaseModel):
    email: str
    password: str

class StudentSearch(BaseModel):
    emailSearch:str
    page:int 
    
class requestNewComment(BaseModel):
    comment_text:str
    owner_email:str
    send_email:str

class changeNewPassword(BaseModel):
    email:str
    current_password:str
    new_password:str
