import pandas as pd
excel_path = '/Users/vvits/airflow/dags/project1_analyze_data/static_data/problem_list.xlsx'
problem_list_data = pd.read_excel(excel_path)

#Get term_id from system_data
system_path = '/Users/vvits/airflow/dags/project1_analyze_data/system_data/system_data.xlsx'
system_df = pd.read_excel(system_path, engine='openpyxl')
term_id = system_df.loc[0, 'termid']
term_id = str(term_id).strip()

problem_paths = ["/Users/vvits/airflow/dags/project1_analyze_data/rank_problem_report/"+term_id+'/' + pid.strip() +'.xlsx' for pid in problem_list_data['Problem_ID']]
df_arr = []


for file_path in problem_paths:
    try:
        problem_df = pd.read_excel(file_path, sheet_name='Sheet1')
        df_arr.append(problem_df)
    except:
        print("Can't read file")

end_df = pd.concat(df_arr, ignore_index=True)
end_df.to_excel("/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/end_report_data.xlsx", index=False)
# by student
end_df['Total_Submission'] = end_df['Compile_error_count'] + end_df['Partial_count'] + end_df['Accept_count']
student_df = end_df.groupby(['StudentID','Email','GVHD']).agg({
    'Total_Submission': 'sum',         
    'Point': 'sum',
    'Max_point': 'sum'       
}).reset_index()

student_df.rename(columns={'Point': 'Total_Point'}, inplace=True)
student_df.rename(columns={'Max_point': 'Total_Max_Point'}, inplace=True)

student_df = student_df.sort_values(by=['Total_Point', 'Total_Submission'], ascending=[False, True])

student_df['Rank'] = student_df['Total_Point'].rank(method='min', ascending=False)

student_df['Rank'] = student_df['Rank'].astype(int)  

excel_file_path = '/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/manager_report_data.xlsx'
student_df.to_excel(excel_file_path, index=False)

# by problem 
problem_df = end_df.groupby(['Problem_Name','Problem_ID','Week'])['status'].value_counts().unstack(fill_value=0)

expected_status_values = [0, 1, 2, 3, 4]
for status in expected_status_values:
    if status not in problem_df:
        problem_df[status] = 0

problem_df.columns = [f'status_{int(col)}' for col in problem_df.columns]

problem_df.reset_index(inplace=True)
totals = end_df.groupby('Problem_ID')[['Max_point', 'Point']].sum().reset_index()
problem_df = pd.merge(problem_df, totals, on='Problem_ID', how='left')

problem_df.to_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/problem_report_data.xlsx', index=False)

# by teacher
student_df['%Point'] = (student_df['Total_Point'] / student_df['Total_Max_Point']) * 100
grouped = student_df.groupby('GVHD')

total_rows = grouped.size().reset_index(name='Count')

rows_above_40 = student_df[student_df['%Point'] > 40].groupby('GVHD').size().reset_index(name='Passed')

teacher_df = pd.merge(total_rows, rows_above_40, on='GVHD', how='left')

teacher_df['Passed'] = teacher_df['Passed'].fillna(0).astype(int)

teacher_df.to_excel('/Users/vvits/airflow/dags/project1_analyze_data/end_report_data/teacher_report_data.xlsx', index=False)