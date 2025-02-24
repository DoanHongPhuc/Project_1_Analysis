import pandas as pd
import os
from pyspark.sql import SparkSession
spark = SparkSession.builder \
    .appName("Create new term data") \
    .getOrCreate()

system_path = '/Users/vvits/airflow/dags/project1_analyze_data/system_data/system_data.xlsx'
system_df = pd.read_excel(system_path, engine='openpyxl')

term_id = system_df.loc[0, 'termid']
week = int(system_df.loc[0, 'Week'])

student_path = '/Users/vvits/airflow/dags/project1_analyze_data/static_data/students_list.xlsx'
student_df = pd.read_excel(student_path, engine='openpyxl')
new_term_id = student_df.loc[0, 'termid']

isCreateProblemReport = False
if new_term_id == term_id:
    if week < 8:
        week = week + 1
        data = {
            'termid': [term_id],
            'Week': [week]
        }
        new_system_df = pd.DataFrame(data)
        new_system_df.to_excel(system_path, index=False)
        isCreateProblemReport = True
    else:
        week = week + 1
else:
    term_id = new_term_id
    week = 1
    data = {
        'termid': [term_id],
        'Week': [week]
    }
    new_system_df = pd.DataFrame(data)
    new_system_df.to_excel(system_path, index=False)
    isCreateProblemReport = True


if isCreateProblemReport:
    problem_path  = '/Users/vvits/airflow/dags/project1_analyze_data/static_data/problem_list.xlsx'
    problem_df = pd.read_excel(problem_path, engine='openpyxl')
    problem_df = problem_df[problem_df['Week'] == week]
    problem_df['merge_key'] = 1
    student_df['merge_key'] = 1
    result_df = pd.merge(student_df, problem_df, on='merge_key')
    result_df.drop('merge_key', axis=1, inplace=True)
    result_df.drop('termid', axis=1, inplace=True)
    result_df['Point'] = 0 
    result_df['Index_of_point'] = 0
    result_df['Compile_error_count'] = 0
    result_df['Partial_count'] = 0
    result_df['Accept_count'] = 0
    grouped = result_df.groupby('Problem_ID')
    if week == 1:
        os.makedirs('/Users/vvits/airflow/dags/project1_analyze_data/problem_report/'+ str(term_id).strip(), exist_ok=True)
        os.makedirs('/Users/vvits/airflow/dags/project1_analyze_data/rank_problem_report/'+ str(term_id).strip(), exist_ok=True)
    for problem_id, problem_df in grouped:
        # Create default problem data
        problem_path = '/Users/vvits/airflow/dags/project1_analyze_data/problem_report/' + str(term_id).strip() + '/' + problem_id.strip() + '.xlsx'
        problem_df['status'] = 0
        problem_df.to_excel(problem_path, index=False)
        # Create default ranking problem data
        rank_path = '/Users/vvits/airflow/dags/project1_analyze_data/rank_problem_report/' + str(term_id).strip() + '/' + problem_id.strip() + '.xlsx'
        problem_df['Rank'] = 0
        problem_df.to_excel(rank_path, index=False)



