from pyspark.sql import SparkSession
from pyspark.sql.functions import col, max as max_
from pyspark.sql.functions import monotonically_increasing_id, row_number
from pyspark.sql.window import Window
import pandas as pd
spark = SparkSession.builder \
    .appName("Calculate new report data") \
    .getOrCreate()

report_df_arr = []
def calculate_new_report_data(row):
    path = row['path']
    arr = path.split('/')
    prob_id = arr[-1].strip()
    stu_id = arr[-2].strip()
    term_id = arr[-3].strip()
    path = "hdfs://localhost:9000/submission_data/" + term_id + '/' + stu_id + '/' + prob_id
    try:
        df = spark.read.option("header", "true").csv(path)
        df = df.orderBy("contest_submission_id")
        df = df.withColumn("point", col("point").cast("integer"))
        max_point = df.select(max_("point")).first()[0]
        windowSpec = Window.orderBy(monotonically_increasing_id())
        df = df.withColumn("row_id", row_number().over(windowSpec))
        first_max_row = df.filter(df["point"] == max_point).orderBy("row_id").first()
        index_of_max_point = first_max_row['row_id']

        compile_error_count = df.filter(col("status") == "Compile Error").count()

        accept_count = df.filter(col("status") == "Accept").count()

        other_status_count = df.filter(~(col("status").isin(["Compile Error", "Accept"]))).count()

        report_df = pd.DataFrame([[stu_id,
                                   prob_id,
                                   max_point,
                                   index_of_max_point,
                                   accept_count,
                                   other_status_count,
                                   compile_error_count ]], 
                                   columns=['Email', 
                                            'Problem_ID', 
                                            'Point',
                                            'Index_of_point',
                                            'Accept_count',
                                            'Partial_count',
                                            'Compile_error_count'])
        report_df_arr.append(report_df)
    except:
        report_df = pd.DataFrame([[stu_id,
                                   prob_id,
                                   0,
                                   0,
                                   0,
                                   0,
                                   0 ]], 
                                   columns=['Email', 
                                            'Problem_ID', 
                                            'Point',
                                            'Index_of_point',
                                            'Accept_count',
                                            'Partial_count',
                                            'Compile_error_count'])
        report_df_arr.append(report_df)
excel_path = "/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/submission_path.xlsx"
excel_df = pd.read_excel(excel_path, sheet_name='Sheet1')

for index,row in excel_df.iterrows():
    calculate_new_report_data(row)

combined_df = pd.concat(report_df_arr, ignore_index=True)
combined_df.to_excel("/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/new_report_data.xlsx", index=False)
    
