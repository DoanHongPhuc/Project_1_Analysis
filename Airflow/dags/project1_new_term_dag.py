import airflow
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash_operator import BashOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
dag = DAG(
    dag_id = "Project1_Create_Default_Report",
    default_args = {
        "owner": "Phuc_Doan",
        "start_date": airflow.utils.dates.days_ago(1)
    },
    schedule_interval='0 0 * * 0' # Chạy vào chủ nhật hàng tuần 
)

start = PythonOperator(
    task_id="start",
    python_callable = lambda: print("Project1_create_default_report started !!!"),
    dag=dag
)
createNewTermData = SparkSubmitOperator(
    task_id="create_default_report",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/Prj1_new_term/1_create_new_term_data.py",
    dag=dag
)


end = PythonOperator(
    task_id="end",
    python_callable = lambda: print("Project1_create_default_report completed successfully !!!"),
    dag=dag
)

start >> createNewTermData >> end