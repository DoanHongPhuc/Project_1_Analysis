import airflow
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash_operator import BashOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
dag = DAG(
    dag_id = "Project1_Analyze_Dag",
    default_args = {
        "owner": "Phuc_Doan",
        "start_date": airflow.utils.dates.days_ago(1)
    },
    schedule_interval = "@daily" 
)

start = PythonOperator(
    task_id="start",
    python_callable = lambda: print("Project1_analyze started !!!"),
    dag=dag
)

getSubmissionData = SparkSubmitOperator(
    task_id="get_submission_data",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/dags/project1_analyze_data/0-get-data-submission.py",
    dag=dag
)

importDataToHadoop = SparkSubmitOperator(
    task_id="import_data_to_hadoop",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/Prj1_new_submission/1_import_submission_to_hadoop.py",
    dag=dag
)

calculateNewReportData = SparkSubmitOperator(
    task_id="calculate_new_report_data",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/Prj1_new_submission/2_calculate_report_data.py",
    dag=dag
)

updateProblemReportData = SparkSubmitOperator(
    task_id="update_problem_report_data",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/Prj1_new_submission/3_update_problem_report.py",
    dag=dag
)

updateRankReportData = SparkSubmitOperator(
    task_id="update_rank_report_data",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/Prj1_new_submission/4_update_rank_problem_data.py",
    dag=dag
)

calculateEndReportData = SparkSubmitOperator(
    task_id="calculate_end_report_data",
    conn_id="spark-conn",
    application="/Users/vvits/airflow/Prj1_new_submission/5_calculate_end_point_data.py",
    dag=dag
)


end = PythonOperator(
    task_id="end",
    python_callable = lambda: print("Project1_analyze completed successfully !!!"),
    dag=dag
)

start >> getSubmissionData >> importDataToHadoop >> calculateNewReportData >> updateProblemReportData >> updateRankReportData >> calculateEndReportData >> end