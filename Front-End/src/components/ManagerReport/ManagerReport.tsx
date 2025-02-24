import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { Select } from "antd";
import type { SelectProps } from "antd";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import ManagerProblemChart from "./ManagerProblemChart";
import Histogram from "./HistogramPoin";
import ManagerTeacherChart from "./ManagerTeacherChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
function ManagerReport() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isExport, setExport] = useState<boolean>(false);
  const [weekFilter, setWeekFilter] = useState<any>([1, 2, 3, 4, 5, 6, 7, 8]);
  const { user_email } = useAuth();
  const [problem_Data, setProblem] = useState<any>([]);
  const [problem_list, setProbList] = useState<any>([]);
  const [status_0, setStatus0] = useState<any>([]);
  const [status_1, setStatus1] = useState<any>([]);
  const [status_2, setStatus2] = useState<any>([]);
  const [status_3, setStatus3] = useState<any>([]);
  const [status_4, setStatus4] = useState<any>([]);
  const [point, setPoint] = useState<any>([]);
  const [student_Data, setStudent] = useState<any>([]);
  const [teacher_Data, setTeacher] = useState<any>([]);
  const [teacher_list, setTeacherList] = useState<any>([]);
  const [stu_number, setStuList] = useState<any>([]);
  const [pass_number, setStuPass] = useState<any>([]);
  const [teacher_scroll, setScroll] = useState<any>(0);
  const options: SelectProps["options"] = [];
  for (let i = 1; i < 9; i++) {
    options.push({
      value: i,
      label: `Tuần ${i}`,
    });
  }
  const handleChange = (value: number | number[]) => {
    setWeekFilter(value);
  };
  useEffect(() => {
    getManagerReportData();
  }, []);
  useEffect(() => {
    if (problem_Data.length > 0) {
      setLoading(true);
      const newproblem = problem_Data.filter((el: any) => {
        const week = el.Week;
        if (weekFilter.includes(week)) {
          return el;
        }
      });
      setProbList(
        newproblem.map((el: any) => {
          return el.Problem_Name;
        })
      );
      setStatus0(newproblem.map((el: any) => el.status_0));
      setStatus1(newproblem.map((el: any) => el.status_1));
      setStatus2(newproblem.map((el: any) => el.status_2));
      setStatus3(newproblem.map((el: any) => el.status_3));
      setStatus4(newproblem.map((el: any) => el.status_4));
      setPoint(
        newproblem.map((el: any) =>
          ((el.Point / el.Max_point) * 100).toFixed(1)
        )
      );
      setLoading(false);
    }
  }, [weekFilter]);
  useEffect(() => {
    if (teacher_Data.length > 0) {
      setLoading(true);
      setTeacherList(
        teacher_Data
          .filter((el: any, index: any) => {
            if (
              index >= teacher_scroll * 20 &&
              index < (teacher_scroll + 1) * 20
            ) {
              return el;
            }
          })
          .map((el: any) => el.GVHD)
      );
      setStuList(
        teacher_Data
          .filter((el: any, index: any) => {
            if (
              index >= teacher_scroll * 20 &&
              index < (teacher_scroll + 1) * 20
            ) {
              return el;
            }
          })
          .map((el: any) => el.Count)
      );
      setStuPass(
        teacher_Data
          .filter((el: any, index: any) => {
            if (
              index >= teacher_scroll * 20 &&
              index < (teacher_scroll + 1) * 20
            ) {
              return el;
            }
          })
          .map((el: any) => el.Passed)
      );

      setLoading(false);
    }
  }, [teacher_scroll]);
  const getManagerReportData = async () => {
    const url = process.env.REACT_APP_API_KEY + `/user/myreport/${user_email}`;
    setLoading(true);
    try {
      const result = await axios.get(url);
      console.log(result);
      if (result.status !== 200) {
        toast.error(result.data.message);
      }
      if (result.status === 200) {
        setProblem(result.data.problem);
        setProbList(
          result.data.problem.map((el: any) => {
            return el.Problem_Name;
          })
        );
        setStatus0(result.data.problem.map((el: any) => el.status_0));
        setStatus1(result.data.problem.map((el: any) => el.status_1));
        setStatus2(result.data.problem.map((el: any) => el.status_2));
        setStatus3(result.data.problem.map((el: any) => el.status_3));
        setStatus4(result.data.problem.map((el: any) => el.status_4));
        setPoint(
          result.data.problem.map((el: any) =>
            ((el.Point / el.Max_point) * 100).toFixed(1)
          )
        );
        setStudent(result.data.point);
        setTeacher(result.data.teacher);
        setTeacherList(
          result.data.teacher
            .filter((el: any, index: any) => {
              if (
                index >= teacher_scroll * 20 &&
                index < (teacher_scroll + 1) * 20
              ) {
                return el;
              }
            })
            .map((el: any) => el.GVHD)
        );
        setStuList(
          result.data.teacher
            .filter((el: any, index: any) => {
              if (
                index >= teacher_scroll * 20 &&
                index < (teacher_scroll + 1) * 20
              ) {
                return el;
              }
            })
            .map((el: any) => el.Count)
        );
        setStuPass(
          result.data.teacher
            .filter((el: any, index: any) => {
              if (
                index >= teacher_scroll * 20 &&
                index < (teacher_scroll + 1) * 20
              ) {
                return el;
              }
            })
            .map((el: any) => el.Passed)
        );
      }
      setLoading(false);
    } catch (e) {
      toast.error("Không thể lấy được dữ liệu báo cáo");
      console.log(e);
    }
  };
  const changeScroll = (value: number) => {
    if (
      teacher_scroll + value >= 0 &&
      (teacher_scroll + value) * 20 < teacher_Data.length
    ) {
      setScroll((teacher_scroll: any) => teacher_scroll + value);
    }
  };
  const exportPDF = () => {
    setExport(true);
    const input = document.getElementById("manager-report-export");
    if (input) {
      const elementsToHide = input.querySelectorAll(".hide-for-pdf");
      elementsToHide.forEach((el: any) => {
        el.style.display = "none";
      });
      const elementsToDisplay = input.querySelectorAll(".pdf-display-block");
      elementsToDisplay.forEach((el: any) => {
        el.style.display = "block";
      });
      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          elementsToHide.forEach((el: any) => {
            el.style.display = "";
          });
          elementsToDisplay.forEach((el: any) => {
            el.style.display = "none";
          });
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
          });

          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          console.log(imgHeight);

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            if (heightLeft > 0) {
              pdf.addPage();
            }
            heightLeft -= pdf.internal.pageSize.getHeight();
          }

          pdf.save(`manager_report.pdf`);
        })
        .finally(() => {
          setExport(false);
        });
    } else {
      setExport(false);
    }
  };
  const exportXLSX = (exportData: any) => {
    const data = exportData;
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "People");

    // Generate buffer
    XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    // Generate binary string
    XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Create a Blob object
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Function to handle Blob object
    function s2ab(s: any) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    // Create URL and download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manager_data.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  };
  return (
    <div>
      {(isLoading || isExport) && <LinearProgress />}
      <div className="w-full flex justify-end items-center p-[10px] pb-[0px] space-x-[10px]">
        <button
          className="py-[4px] px-[10px] rounded-md border border-[#d4d4d4]  bg-[#0086ff] hover:bg-[#007bff] text-white"
          onClick={() => {
            exportXLSX(problem_Data);
          }}
        >
          {isExport ? "Generating XLSX..." : "Export XLSX"}
        </button>
        <button
          className="py-[4px] px-[10px] rounded-md border border-[#d4d4d4]  bg-[#0086ff] hover:bg-[#007bff] text-white"
          onClick={() => {
            exportPDF();
          }}
        >
          {isExport ? "Generating PDF..." : "Export PDF"}
        </button>
      </div>
      <div id="manager-report-export" className="w-full h-full p-[10px]">
        <div className="header w-full bg-[#f0ebe8] text-[28px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
          <p>Báo cáo quản lý môn học</p>
          <div className="pdf-display-block mb-[20px] hidden"></div>
        </div>
        <div className="w-full mt-[10px] flex gap-[8px]">
          <div className="flex-1 flex flex-col" style={{ height: "inherit" }}>
            <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
              <p>Thông tin chung về khóa học</p>
              <div className="pdf-display-block mb-[20px] hidden"></div>
            </div>
            <div className="flex items-center border border-[#d4d4d4] flex-1 pt-[20px]">
              <div className="flex-1 h-full flex flex-col">
                <div>
                  <p className="text-[20px] text-[#6b6b6b] text-center text-u">
                    Số giảng viên
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                    {teacher_Data.length}
                  </p>
                </div>
              </div>
              <div className="flex-1 h-full flex flex-col">
                <div>
                  <p className="text-[20px] text-[#6b6b6b] text-center">
                    Số sinh viên
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                    {student_Data.length}
                  </p>
                </div>
              </div>
              <div className="flex-1 h-full flex flex-col">
                <div>
                  <p className="text-[20px] text-[#6b6b6b] text-center">
                    Số bài tập
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                    {problem_list.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" hide-for-pdf mt-[10px]">
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Bộ lộc theo tuần</p>
          </div>
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={weekFilter}
            onChange={handleChange}
            style={{ width: "100%" }}
            options={options}
          />
        </div>

        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Báo cáo đánh giá bài tập</p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <ManagerProblemChart
              status_0={status_0}
              status_1={status_1}
              status_2={status_2}
              status_3={status_3}
              status_4={status_4}
              point={point}
              list={problem_list}
              loading={isLoading}
            />
          </div>
        </div>
        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Phổ điểm của sinh viên trên tất cả các bài thi</p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <Histogram data={student_Data} />
          </div>
        </div>
        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Báo cáo đối với giáo viên</p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <ManagerTeacherChart
              data1={stu_number}
              data2={pass_number}
              loading={isLoading}
              teacher={teacher_list}
            />
            <div className="flex items-center justify-center space-x-[60px] mt-[10px] mb-[10px]">
              <button
                className="py-[4px] px-[30px] rounded border border-[#d4d4d4] hover:bg-[#d4d4d4]"
                onClick={() => {
                  changeScroll(-1);
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {(teacher_scroll + 1) * 20 > teacher_Data.length && (
                <p>
                  {`${teacher_scroll * 20 + 1} - ${teacher_Data.length} / ${
                    teacher_Data.length
                  }`}{" "}
                </p>
              )}
              {(teacher_scroll + 1) * 20 < teacher_Data.length && (
                <p>{`${teacher_scroll * 20 + 1} - ${
                  (teacher_scroll + 1) * 20
                } / ${teacher_Data.length}`}</p>
              )}
              <button
                className="py-[4px] px-[30px] rounded border border-[#d4d4d4] hover:bg-[#d4d4d4]"
                onClick={() => {
                  changeScroll(1);
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerReport;
