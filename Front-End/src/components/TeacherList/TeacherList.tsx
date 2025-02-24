import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
function TeacherList() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [stuList, setstuList] = useState<any>([]);
  const [numPage, setNumPage] = useState<any>(0);
  const navigate = useNavigate();
  const { updateStuEmail } = useAuth();
  const [emailSearch, setEmailSearch] = useState<string>("");

  const getReportData = async () => {
    const url = process.env.REACT_APP_API_KEY + `/teacher/list/`;
    const data = {
      emailSearch: emailSearch,
      page: page,
    };
    setLoading(true);
    try {
      const result = await axios.post(url, data);
      if (result.status !== 200) {
        toast.error(result.data.message);
      }
      if (result.status === 200) {
        console.log(result);

        setstuList(result.data.teacher);
        setNumPage(Math.floor(result.data.number_teacher / size));
      }
      setLoading(false);
    } catch (e) {
      toast.error("Không thể lấy được dữ liệu báo cáo");
      console.log(e);
    }
  };
  useEffect(() => {
    getReportData();
  }, [page]);
  const columns: TableProps<any>["columns"] = [
    {
      title: "Mã giáo viên",
      dataIndex: "Teacher_id",
      key: "Problem_ID",
    },
    {
      title: "Tên bài tập",
      dataIndex: "Teacher_name",
      key: "Teacher_name",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
  ];
  const changePage = (value: number) => {
    if (page + value >= 0 && page + value <= numPage) {
      setPage(page + value);
    }
  };
  return (
    <div>
      {isLoading && <LinearProgress />}
      <div className="m-[10px] border border-[#d4d4d4] rounded-md">
        <div className="bg-[#f0ebe8] border border-[#d4d4d4]">
          <p className="pdf_padding text-[28px] text-[#6b6b6b] text-center">
            Danh sách giảng viên
          </p>
          <div className="pdf-display-block mb-[20px] hidden"></div>
        </div>
        <div className="flex items-center justify-end overflow-hidden mr-[10px]">
          <input
            className="w-[600px] px-[4px] py-[4px] my-[10px] border border-[#d9d9d9] border-r-[0px] rounded-l-md outline-none"
            type="text"
            placeholder="Search sinh viên theo email"
            onChange={(e: any) => {
              setEmailSearch(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setPage(0);
              getReportData();
            }}
            className="px-[20px] py-[5.5px] bg-[#1677ff] text-white border border-[#1677ff] rounded-r-md hover:bg-[#4096ff] text-[14px]"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <Table columns={columns} dataSource={stuList} pagination={false} />
        <div className="flex items-center justify-center space-x-[60px] mt-[10px] mb-[10px]">
          <button
            className="py-[4px] px-[30px] rounded border border-[#d4d4d4] hover:bg-[#d4d4d4]"
            onClick={() => {
              changePage(-1);
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p>{`${page + 1} / ${numPage}`}</p>

          <button
            className="py-[4px] px-[30px] rounded border border-[#d4d4d4] hover:bg-[#d4d4d4]"
            onClick={() => {
              changePage(1);
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherList;
