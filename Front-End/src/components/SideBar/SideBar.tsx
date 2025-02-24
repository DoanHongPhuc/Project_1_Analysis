import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonChalkboard,
  faUserGraduate,
  faAddressBook,
  faSliders,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/auth";

function SideBar(props: any) {
  const { role, user_name, updateUserInfo } = useAuth();
  const [isTeacher, setIsTeacher] = useState<any>(role === "2");
  const [isManager, setIsManager] = useState<any>(role === "3");
  const [open, setOpen] = useState(true);
  const Avatar: string = user_name?.charAt(0)
    ? user_name?.charAt(0).toLocaleUpperCase()
    : "P";
  const navigation = useNavigate();

  function handleLogout(e: any) {
    e.preventDefault();
    updateUserInfo(null, null, null, null);
    navigation("/login");
  }

  let reportClassname =
    "nav-item flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  let studentClassname =
    "nav-item flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  let teacherClassname =
    "nav-item flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  let changeClassname =
    "nav-item flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  let termClassname =
    "nav-item flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  if (props.path === "/report") {
    reportClassname =
      "nav-item-select flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  }
  if (props.path === "/student") {
    studentClassname =
      "nav-item-select flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  }
  if (props.path === "/teacher") {
    teacherClassname =
      "nav-item-select flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  }
  if (props.path === "/change_password") {
    changeClassname =
      "nav-item-select flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  }

  if (props.path === "/term_setting") {
    termClassname =
      "nav-item-select flex items-center w-full text-base font-medium py-[8px] pl-[12px] rounded-md";
  }

  if (!open) {
    return (
      <div
        className="Close text-base text-slate-500 w-8 m-3 hover:cursor-pointer w-9 h-9 rounded-lg hover:bg-gray-200 flex items-center justify-center"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="side_bar_container flex flex-col">
      <div className="header_container">
        <div className="header flex p-3 justify-between item-center h-[80px] bg-slate-200 rounded-b-md">
          <div className="User flex justify-center items-center border border-transparent pl-1.5 pr-3">
            <div className="Avatar mr-3">
              <p className="side_bar_avatar flex justify-center items-center ">
                {Avatar}
              </p>
            </div>
            <div className="Username flex justify-center items-center">
              <p className="flex-1 font-bold leading-6 mr-2">{user_name}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="side_bar_body py-2 flex-1">
        <div className="h-full flex flex-col justify-between">
          <ul className="space-y-[10px]">
            <li>
              <Link
                to={"/"}
                onClick={() => {
                  props.clearCache();
                }}
              >
                <div className={reportClassname}>
                  <div className="nav-icon text-emerald-500">
                    <FontAwesomeIcon icon={faAddressBook} />
                  </div>
                  <p className="h-6 ml-1.5">Báo Cáo Học Tập</p>
                </div>
              </Link>
            </li>
            {isManager && (
              <li>
                <Link to={"/teacher"}>
                  <div className={teacherClassname}>
                    <div className="nav-icon text-emerald-500">
                      <FontAwesomeIcon icon={faPersonChalkboard} />
                    </div>
                    <p className="h-6 ml-1.5">Danh sách giảng viên</p>
                  </div>
                </Link>
              </li>
            )}
            {isManager && (
              <li>
                <Link to={"/student"}>
                  <div className={studentClassname}>
                    <div className="nav-icon text-emerald-500">
                      <FontAwesomeIcon icon={faUserGraduate} />
                    </div>
                    <p className="h-6 ml-1.5">Danh sách sinh viên</p>
                  </div>
                </Link>
              </li>
            )}
            {isManager && (
              <li>
                <Link to={"/term_setting"}>
                  <div className={termClassname}>
                    <div className="nav-icon text-emerald-500">
                      <FontAwesomeIcon icon={faSliders} />
                    </div>
                    <p className="h-6 ml-1.5">Cập nhật dữ liệu kì học</p>
                  </div>
                </Link>
              </li>
            )}
            <li>
              <Link to={"/change_password"}>
                <div className={changeClassname}>
                  <div className="nav-icon text-emerald-500">
                    <FontAwesomeIcon icon={faUserLock} />
                  </div>
                  <p className="h-6 ml-1.5">Đổi mật khẩu</p>
                </div>
              </Link>
            </li>
          </ul>
          <div className="mb-[20px]">
            <Link to={"/login"} onClick={handleLogout}>
              <div className="nav-item flex items-center w-full p-1.5 p-1 text-base font-medium py-2 rounded-md">
                <div className="nav-icon text-amber-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="NAFqZpweVv2qW6PZaB6UegeDrhQeAToS"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M17.5 6.001h-3a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5Zm-3-1a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3Zm-8 9h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm-1.5.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3Zm9.5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm-1.5.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3Zm-6.5-8.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm-1.5.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3Z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <p className="h-6 ml-1.5">Đăng xuất</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SideBar;
