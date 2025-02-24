import { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import StackedSubmissionChart from "./StackedSubmission";
import PointBarChart from "./PointBarChart";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";
import type { SelectProps } from "antd";
import { LinearProgress } from "@mui/material";
import { useAuth } from "../../context/auth";
import DonutStatusChart from "./DonutStatusChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import CommentStudent from "../CommentStudent/CommentStudent";
function StudentReport(props: any) {
  const { role } = useAuth();
  const [showComment, setShowComment] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [numberStudent, setNumberStudent] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const [maxpoint, setMaxPoint] = useState<number>(0);
  const [point, setPoint] = useState<number>(0);
  const [acceptCount, setAccept] = useState<number>(0);
  const [PartialCount, setPartialCount] = useState<number>(0);
  const [CompileCount, setCompileCount] = useState<number>(0);
  const [AcceptStackChartData, setAcceptStackChartData] = useState<any>([]);
  const [PartialStackChartData, setPartialStackChartData] = useState<any>([]);
  const [CompileStackChartData, setCompileStackChartData] = useState<any>([]);
  const [IndexStackChartData, setIndexStackChartData] = useState<any>([]);
  const [status_0, setStatus0] = useState<any>(0);
  const [status_1, setStatus1] = useState<any>(0);
  const [status_2, setStatus2] = useState<any>(0);
  const [status_3, setStatus3] = useState<any>(0);
  const [status_4, setStatus4] = useState<any>(0);
  const [weekMaxPoint, setWeekMaxPoint] = useState<number>(0);
  const [weekPoint, setWeekPoint] = useState<number>(0);

  const [pointChartData, setPointChartData] = useState<any>([]);
  const [problemList, setProblemList] = useState<any>([""]);
  const [weekFilter, setWeekFilter] = useState<any>([1, 2, 3, 4, 5, 6, 7, 8]);
  const options: SelectProps["options"] = [];
  const [problemData, setProblemData] = useState<any>([]);
  const [isExport, setExport] = useState<boolean>(false);
  for (let i = 1; i < 9; i++) {
    options.push({
      value: i,
      label: `Tuần ${i}`,
    });
  }

  useEffect(() => {
    getStudentReportData();
  }, []);
  useEffect(() => {
    if (problemData.length > 0) {
      setLoading(true);
      const newproblem = problemData.filter((el: any) => {
        const week = el.Week;
        if (weekFilter.includes(week)) {
          return el;
        }
      });
      setAcceptStackChartData(
        newproblem.map((el: any) => {
          return el.Accept_count;
        })
      );
      setPartialStackChartData(
        newproblem.map((el: any) => {
          return el.Partial_count;
        })
      );
      setCompileStackChartData(
        newproblem.map((el: any) => {
          return el.Compile_error_count;
        })
      );
      setIndexStackChartData(
        newproblem.map((el: any) => {
          return el.Index_of_point;
        })
      );
      setProblemList(
        newproblem.map((el: any) => {
          return el.Problem_Name;
        })
      );
      setPointChartData(
        newproblem.map((el: any) => {
          return {
            Point: el.Point,
            Max_point: el.Max_point,
            Rank: el.Rank,
          };
        })
      );
      setAccept(
        newproblem.reduce((total: number, el: any) => {
          return total + el.Accept_count;
        }, 0)
      );
      setPartialCount(
        newproblem.reduce((total: number, el: any) => {
          return total + el.Partial_count;
        }, 0)
      );
      setCompileCount(
        newproblem.reduce((total: number, el: any) => {
          return total + el.Compile_error_count;
        }, 0)
      );
      setStatus0(
        newproblem.reduce((total: number, el: any) => {
          if (el.status === 0) return total + 1;
          else return total;
        }, 0)
      );
      setStatus1(
        newproblem.reduce((total: number, el: any) => {
          if (el.status === 1) return total + 1;
          else return total;
        }, 0)
      );
      setStatus2(
        newproblem.reduce((total: number, el: any) => {
          if (el.status === 2) return total + 1;
          else return total;
        }, 0)
      );
      setStatus3(
        newproblem.reduce((total: number, el: any) => {
          if (el.status === 3) return total + 1;
          else return total;
        }, 0)
      );
      setStatus4(
        newproblem.reduce((total: number, el: any) => {
          if (el.status === 4) return total + 1;
          else return total;
        }, 0)
      );
      setWeekMaxPoint(
        newproblem.reduce((total: number, el: any) => {
          return total + el.Max_point;
        }, 0)
      );
      setWeekPoint(
        newproblem.reduce((total: number, el: any) => {
          return total + el.Point;
        }, 0)
      );
      setLoading(false);
    }
  }, [weekFilter]);
  const getStudentReportData = async () => {
    const url =
      role === "1"
        ? process.env.REACT_APP_API_KEY + `/user/myreport/${props.email}`
        : process.env.REACT_APP_API_KEY + `/user/student/${props.email}`;
    try {
      setLoading(true);
      const result = await axios.get(url);
      console.log(result);
      if (result.status !== 200) {
        toast.error(result.data.message);
      }
      if (result.status === 200) {
        setProblemData(result.data.problem);
        setNumberStudent(result.data.number_student);
        setRank(result.data.total[0].Rank);
        setMaxPoint(result.data.total[0].Total_Max_Point);
        setPoint(result.data.total[0].Total_Point);
        setAccept(
          result.data.problem.reduce((total: number, el: any) => {
            return total + el.Accept_count;
          }, 0)
        );
        setPartialCount(
          result.data.problem.reduce((total: number, el: any) => {
            return total + el.Partial_count;
          }, 0)
        );
        setCompileCount(
          result.data.problem.reduce((total: number, el: any) => {
            return total + el.Compile_error_count;
          }, 0)
        );
        setAcceptStackChartData(
          result.data.problem.map((el: any) => {
            return el.Accept_count;
          })
        );
        setPartialStackChartData(
          result.data.problem.map((el: any) => {
            return el.Partial_count;
          })
        );
        setCompileStackChartData(
          result.data.problem.map((el: any) => {
            return el.Compile_error_count;
          })
        );
        setIndexStackChartData(
          result.data.problem.map((el: any) => {
            return el.Index_of_point;
          })
        );
        setProblemList(
          result.data.problem.map((el: any) => {
            return el.Problem_Name;
          })
        );
        setPointChartData(
          result.data.problem.map((el: any) => {
            return {
              Point: el.Point,
              Max_point: el.Max_point,
              Rank: el.Rank,
            };
          })
        );

        setStatus0(
          result.data.problem.reduce((total: number, el: any) => {
            if (el.status === 0) return total + 1;
            else return total;
          }, 0)
        );
        setStatus1(
          result.data.problem.reduce((total: number, el: any) => {
            if (el.status === 1) return total + 1;
            else return total;
          }, 0)
        );
        setStatus2(
          result.data.problem.reduce((total: number, el: any) => {
            if (el.status === 2) return total + 1;
            else return total;
          }, 0)
        );
        setStatus3(
          result.data.problem.reduce((total: number, el: any) => {
            if (el.status === 3) return total + 1;
            else return total;
          }, 0)
        );
        setStatus4(
          result.data.problem.reduce((total: number, el: any) => {
            if (el.status === 4) return total + 1;
            else return total;
          }, 0)
        );
        setWeekMaxPoint(
          result.data.problem.reduce((total: number, el: any) => {
            return total + el.Max_point;
          }, 0)
        );
        setWeekPoint(
          result.data.problem.reduce((total: number, el: any) => {
            return total + el.Point;
          }, 0)
        );
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Không thể lấy được dữ liệu báo cáo");
      console.log(e);
    }
  };
  const handleChange = (value: number | number[]) => {
    setWeekFilter(value);
  };
  const exportPDF = () => {
    setExport(true);
    const input = document.getElementById("student-report-export");
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

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
          }

          pdf.save(`${props.email}_report.pdf`);
        })
        .finally(() => {
          setExport(false);
        });
    } else {
      setExport(false);
    }
  };
  const exportXLSX = () => {
    const data = problemData;
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
    a.download = `${props.email}_data.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  };
  return (
    <div id="body_element">
      {(isLoading || isExport) && <LinearProgress />}

      <div className="w-full flex justify-end items-center p-[10px] pb-[0px] space-x-[10px]">
        {role !== "3" && (
          <button
            onClick={() => {
              setShowComment(!showComment);
            }}
            className="py-[4px] px-[10px] rounded-md border border-[#d4d4d4]  bg-[#0086ff] hover:bg-[#007bff] text-white"
          >
            {showComment && <p>Ẩn nhận xét</p>}
            {!showComment && (
              <p>{role === "1" ? "Xem nhận xét" : "Nhận xét"}</p>
            )}
          </button>
        )}
        <button
          className="py-[4px] px-[10px] rounded-md border border-[#d4d4d4]  bg-[#0086ff] hover:bg-[#007bff] text-white"
          onClick={() => {
            exportXLSX();
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
      {showComment && <CommentStudent />}
      <div id="student-report-export" className="w-full h-full p-[10px]">
        <div className="bg-[#f0ebe8] border border-[#d4d4d4]">
          <p className="pdf_padding text-[28px] text-[#6b6b6b] text-center">
            Báo cáo kết quả học tập
          </p>
          <div className="pdf-display-block mb-[20px] hidden"></div>
        </div>

        {role !== "1" && (
          <div className="flex-1 flex flex-col" style={{ height: "inherit" }}>
            <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
              <p>Sinh viên</p>
              <div className="pdf-display-block mb-[12px] hidden"></div>
            </div>
            <div className="flex items-center border border-[#d4d4d4] flex-1 pt-[20px]">
              <div className="flex-1 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[20px] text-[#6b6b6b] text-center pb-[20px]">
                    {props.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-[10px] flex flex-col" style={{ height: "inherit" }}>
          <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
            <p>Kết quả tổng kết</p>
            <div className="pdf-display-block mb-[12px] hidden"></div>
          </div>
          <div className="flex items-center border border-[#d4d4d4] flex-1 pt-[20px]">
            <div className="flex-1 h-full flex flex-col">
              <div>
                <p className="text-[20px] text-[#6b6b6b] text-center text-u">
                  Điểm đạt được
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                  {`${point} / ${maxpoint}`}
                </p>
              </div>
            </div>
            <div className="flex-1 h-full flex flex-col">
              <div>
                <p className="text-[20px] text-[#6b6b6b] text-center">
                  Thứ hạng của bạn
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                  {`${rank} / ${numberStudent}`}
                </p>
              </div>
            </div>
            <div className="flex-1 h-full flex flex-col">
              <div>
                <p className="text-[20px] text-[#6b6b6b] text-center">
                  Giảng viên hướng dẫn
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                  {problemData.length > 0 ? problemData[0].GVHD : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hide-for-pdf mt-[10px]">
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Kết quả tùy chọn theo tuần</p>
            <div className="pdf-display-block mb-[16px] hidden"></div>
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
        <div className="mt-[10px] flex flex-col" style={{ height: "inherit" }}>
          <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
            <p>Điểm đạt được theo tuần</p>
            <div className="pdf-display-block mb-[12px] hidden"></div>
          </div>
          <div className="flex items-center border border-[#d4d4d4] flex-1 pt-[20px]">
            <div className="flex-1 h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                  {`${weekPoint} / ${weekMaxPoint}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-[10px] flex gap-[8px]">
          <div className="flex-1 ">
            <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
              <p>Trạng thái Submission</p>
              <div className="pdf-display-block mb-[16px] hidden"></div>
            </div>
            <div>
              <DonutChart
                series={[acceptCount, PartialCount, CompileCount]}
                loading={isLoading}
              />
            </div>
          </div>
          <div className="flex-1 ">
            <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
              <p>Trạng thái bài tập</p>
              <div className="pdf-display-block mb-[16px] hidden"></div>
            </div>
            <div>
              <DonutStatusChart
                series={[status_0, status_1, status_2, status_3, status_4]}
                loading={isLoading}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Điểm đạt theo từng bài</p>
            <div className="pdf-display-block mb-[16px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <PointBarChart
              problemData={pointChartData}
              loading={isLoading}
              problem={problemList}
              number_student={numberStudent}
            />
          </div>
        </div>
        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Trạng thái Submission theo từng bài</p>
            <div className="pdf-display-block mb-[16px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <StackedSubmissionChart
              accept={AcceptStackChartData}
              partial={PartialStackChartData}
              compile={CompileStackChartData}
              index={IndexStackChartData}
              problem={problemList}
              loading={isLoading}
            ></StackedSubmissionChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentReport;
