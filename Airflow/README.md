## Cài đặt và chạy ứng dụng

# Cài đặt

Cài đặt Hadoop = 3.2.4

Cài đặt Airflow = 2.7.3

Cài đặt Spark = 3.5.0

Thêm thư mục Airflow vào file luồng dữ liệu của airflow

# Chạy ứng dụng

Airflow:

airflow webserver -p 3000 &
airflow scheduler

Spark:
spark-class org.apache.spark.deploy.master.Master --host 127.0.0.1 --port 7077
spark-class org.apache.spark.deploy.worker.Worker spark://127.0.0.1:7077

Hadoop

start-all.sh
