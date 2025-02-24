from pyspark.sql import SparkSession
from pyspark.sql.functions import concat, col, lit
from pyspark.sql import Row
import pandas as pd
spark = SparkSession.builder \
    .appName("Filter Project_1 Submission Data") \
    .getOrCreate()

submission_path = "/Users/vvits/airflow/dags/project1_analyze_data/sample_data/sample_data_3.xlsx"
hdfs_path = "hdfs://localhost:9000/submission_data/"
df = pd.read_excel(submission_path, sheet_name='Sheet1')
spark_df = spark.createDataFrame(df)
# Filter submissions of project1
project1_df = spark_df.filter(col("contest_id").startswith("PROJECT1"))

# Get Termid
contest_id = project1_df.select("contest_id").first()[0]
term_id = contest_id.split("_")[1]
hdfs_path += term_id + '/'

# Create new column "Path"
project1_df = project1_df.withColumn("path", concat(lit(hdfs_path), col("user_submission_id"), lit('/'), col("problem_id")))

project1_df.show()
# output xlsx

pandas_df = project1_df.toPandas()
pandas_df.to_excel("/Users/vvits/airflow/dags/project1_analyze_data/calculate_data/submission_data.xlsx", index=False)