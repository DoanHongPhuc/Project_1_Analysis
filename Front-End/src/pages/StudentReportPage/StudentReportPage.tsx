import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import StudentReport from "../../components/StudentReport/StudentReport";
import TeacherReport from "../../components/TeacherReport/TeacherReport";
import { useNavigate } from "react-router-dom";
function StudentReportPage() {
  const { role, user_email, std_email, updateStuEmail } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (std_email === null) {
      navigate("/");
    }
  }, []);

  return <div>{std_email !== null && <StudentReport email={std_email} />}</div>;
}
export default StudentReportPage;
