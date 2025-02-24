import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import SideBarLayout from "../layouts/SideBarLayout/SideBarLayout";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ReportPage from "../pages/Report/ReportPage";
import StudentPage from "../pages/Student/Student";
import StudentReportPage from "../pages/StudentReportPage/StudentReportPage";
import TeacherPage from "../pages/Teacher/TeacherPage";
import TermSetting from "../components/TermSetting/TermSetting";

const publicRouter = [
  { path: "/login", page: Login, layout: DefaultLayout },
  { path: "/register", page: Register, layout: DefaultLayout },
];
const privateRouter = [
  { path: "/report", page: ReportPage, layout: SideBarLayout },
  { path: "/teacher", page: TeacherPage, layout: SideBarLayout },
  { path: "/student", page: StudentPage, layout: SideBarLayout },
  { path: "/change_password", page: ChangePassword, layout: SideBarLayout },
  { path: "/student_report", page: StudentReportPage, layout: SideBarLayout },
  { path: "/term_setting", page: TermSetting, layout: SideBarLayout },
];

export { publicRouter, privateRouter };
