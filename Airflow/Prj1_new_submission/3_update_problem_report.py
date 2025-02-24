from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import pandas as pd
spark = SparkSession.builder \
    .appName("Update problem report data") \
    .getOrCreate()

#Get term_id from system_data
system_path = '/Users/vvits/airflow/dags/project1_analyze_data/system_data/system_data.xlsx'
system_df = pd.read_excel(system_path, engine='openpyxl')
term_id = system_df.loc[0, 'termid']
term_id = str(term_id).strip()
def calculate_status(max_point,point):
    if max_point == point:
        return 4
    elif max_point * 0.7 <= point < max_point:
        return 3
    elif max_point * 0.4 <= point < max_point*0.7:
        return 2
    elif 0 <= point < max_point*0.4:
        return 1
    else:
        return 0
def updateProblemReportData(df,path):
    pandas_df =   df.toPandas()
    excel_df = pd.read_excel(path, sheet_name='Sheet1')
    max_point = int(excel_df.iloc[0]['Max_point'])
    for index,update_row in pandas_df.iterrows():
        status = calculate_status(max_point,update_row['Point'])
        excel_df.loc[excel_df['Email']==update_row['Email'],'Point'] = update_row['Point']
        excel_df.loc[excel_df['Email']==update_row['Email'],'Index_of_point'] = update_row['Index_of_point']
        excel_df.loc[excel_df['Email']==update_row['Email'],'Compile_error_count'] = update_row['Compile_error_count']
        excel_df.loc[excel_df['Email']==update_row['Email'],'Partial_count'] = update_row['Partial_count']
        excel_df.loc[excel_df['Email']==update_row['Email'],'Accept_count'] = update_row['Accept_count']
        excel_df.loc[excel_df['Email']==update_row['Email'],'status'] = status
    
    excel_df.to_excel(path, index=False)


excel_path = "/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/new_report_data.xlsx"
excel_df = pd.read_excel(excel_path, sheet_name='Sheet1')
spark_df = spark.createDataFrame(excel_df)
paths = spark_df.select("Problem_ID").distinct().collect()

for row in paths:
    Problem_ID = row.Problem_ID 
    filtered_df = spark_df.filter(col("Problem_ID") == Problem_ID)
    path = '/Users/vvits/airflow/dags/project1_analyze_data/problem_report/'+term_id+'/' + Problem_ID.strip() + '.xlsx'
    updateProblemReportData(filtered_df,path)


