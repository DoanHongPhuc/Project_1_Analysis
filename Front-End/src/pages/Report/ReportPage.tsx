import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/auth";
import { useState } from "react";
import StudentReport from "../../components/StudentReport/StudentReport";
import TeacherReport from "../../components/TeacherReport/TeacherReport";
import ManagerReport from "../../components/ManagerReport/ManagerReport";
function ReportPage() {
  const { role, user_email } = useAuth();
  const [isStudent] = useState<any>(role === "1");
  const [isTeacher] = useState<any>(role === "2");
  const [isManager] = useState<any>(role === "3");

  return (
    <div>
      {isStudent && <StudentReport email={user_email} />}

      {isTeacher && (
        <div>
          <TeacherReport email={user_email} />
        </div>
      )}

      {isManager && <ManagerReport />}
    </div>
  );
}
export default ReportPage;
