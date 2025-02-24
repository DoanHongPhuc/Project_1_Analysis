from pyspark.sql import SparkSession
import pandas as pd
spark = SparkSession.builder \
    .appName("Update rank problem report") \
    .getOrCreate()

#Get term_id from system_data
system_path = '/Users/vvits/airflow/dags/project1_analyze_data/system_data/system_data.xlsx'
system_df = pd.read_excel(system_path, engine='openpyxl')
term_id = system_df.loc[0, 'termid']
term_id = str(term_id).strip()


excel_path = "/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/new_report_data.xlsx"
excel_df = pd.read_excel(excel_path, sheet_name='Sheet1')
spark_df = spark.createDataFrame(excel_df)
paths = spark_df.select("Problem_ID").distinct().collect()

for row in paths:
    Problem_ID = row.Problem_ID 
    problem_path = '/Users/vvits/airflow/dags/project1_analyze_data/problem_report/'+term_id+'/' + Problem_ID.strip() + '.xlsx'
    rank_path = '/Users/vvits/airflow/dags/project1_analyze_data/rank_problem_report/'+term_id+'/' + Problem_ID.strip() + '.xlsx'
    problem_df = pd.read_excel(problem_path, sheet_name='Sheet1')
    problem_df['Rank'] = problem_df['Point'].rank(method='min', ascending=False)
    problem_df.to_excel(rank_path, index=False)

