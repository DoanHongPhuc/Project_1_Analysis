from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import pandas as pd
spark = SparkSession.builder \
    .appName("Import submission data to Hadoop") \
    .getOrCreate()

xlsx_path = "/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/submission_data.xlsx"
df = pd.read_excel(xlsx_path, sheet_name='Sheet1')
spark_df = spark.createDataFrame(df)
paths = spark_df.select("path").distinct().collect()

path_df = pd.DataFrame(paths, columns=['path'])
path_df.to_excel('/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/submission_path.xlsx', index=False)
for row in paths:
    path_value = row.path 
    df_filtered = spark_df.filter(col("path") == path_value)
    df_filtered.write.csv(path_value, header=True, mode="append")