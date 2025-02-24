import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { Select } from "antd";
import type { SelectProps } from "antd";
import StudentSubChart from "./StudenSubmission";
import StuPointChart from "./StudentPoint";
import axios from "axios";
import { toast } from "react-toastify";
import HeatMapChart from "./HeatMap";
import { useAuth } from "../../context/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
function TeacherReport(props: any) {
  const { user_name } = useAuth();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [stuList, setStuList] = useState<any>([]);
  const [accept, setAccept] = useState<any>([]);
  const [partial, setPartial] = useState<any>([]);
  const [compile, setCompile] = useState<any>([]);
  const [pointData, setPointData] = useState<any>([]);
  const [heatMapData, setHeatMapData] = useState<any>([]);
  const [weekFilter, setWeekFilter] = useState<any>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [problemData, setProblemData] = useState<any>([]);
  const [xlsxData, setXLSX] = useState<any>([]);
  const [isExport, setExport] = useState<boolean>(false);

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
    getTeacherReportData();
  }, []);
  useEffect(() => {
    if (problemData.length > 0) {
      setLoading(true);
      const newproblem = problemData.map((stuReport: any) => {
        return stuReport.filter((el: any) => {
          const week = el.Week;
          if (weekFilter.includes(week)) {
            return el;
          }
        });
      });
      setAccept(
        newproblem.map((stu_prob: any) => {
          const sum = stu_prob.reduce((sum: any, el: any) => {
            return el.Accept_count + sum;
          }, 0);
          return sum;
        })
      );
      setPartial(
        newproblem.map((stu_prob: any) => {
          const sum = stu_prob.reduce((sum: any, el: any) => {
            return el.Partial_count + sum;
          }, 0);
          return sum;
        })
      );
      setCompile(
        newproblem.map((stu_prob: any) => {
          const sum = stu_prob.reduce((sum: any, el: any) => {
            return el.Compile_error_count + sum;
          }, 0);
          return sum;
        })
      );
      setPointData(
        newproblem.map((stu_prob: any) => {
          const point = stu_prob.reduce((sum: any, el: any) => {
            return el.Point + sum;
          }, 0);
          const max_point = stu_prob.reduce((sum: any, el: any) => {
            return el.Max_point + sum;
          }, 0);
          return {
            Point: point,
            Max_point: max_point,
          };
        })
      );
      setHeatMapData(
        newproblem.map((stu_prob: any) => {
          const data = stu_prob.map((el: any) => {
            return {
              point: el.Point,
              max_point: el.Max_point,
              week: el.Week,
              problem_Name: el.Problem_Name,
              index: el.Index,
            };
          });
          return data;
        })
      );
      setLoading(false);
    }
  }, [weekFilter]);
  const getTeacherReportData = async () => {
    const url = process.env.REACT_APP_API_KEY + `/user/myreport/${props.email}`;
    setLoading(true);
    try {
      const result = await axios.get(url);
      console.log(result);
      if (result.status !== 200) {
        toast.error(result.data.message);
      }
      if (result.status === 200) {
        setStuList(result.data.student);
        let combinedArray: any[] = [];
        result.data.report.forEach((arr: any) => {
          combinedArray = combinedArray.concat(arr);
        });
        setXLSX(combinedArray);
        setAccept(
          result.data.report.map((stu_prob: any) => {
            const sum = stu_prob.reduce((sum: any, el: any) => {
              return el.Accept_count + sum;
            }, 0);
            return sum;
          })
        );
        setPartial(
          result.data.report.map((stu_prob: any) => {
            const sum = stu_prob.reduce((sum: any, el: any) => {
              return el.Partial_count + sum;
            }, 0);
            return sum;
          })
        );
        setCompile(
          result.data.report.map((stu_prob: any) => {
            const sum = stu_prob.reduce((sum: any, el: any) => {
              return el.Compile_error_count + sum;
            }, 0);
            return sum;
          })
        );
        setPointData(
          result.data.report.map((stu_prob: any) => {
            const point = stu_prob.reduce((sum: any, el: any) => {
              return el.Point + sum;
            }, 0);
            const max_point = stu_prob.reduce((sum: any, el: any) => {
              return el.Max_point + sum;
            }, 0);
            return {
              Point: point,
              Max_point: max_point,
            };
          })
        );
        setHeatMapData(
          result.data.report.map((stu_prob: any) => {
            const data = stu_prob.map((el: any) => {
              return {
                point: el.Point,
                max_point: el.Max_point,
                week: el.Week,
                problem_Name: el.Problem_Name,
                index: el.Index,
              };
            });
            return data;
          })
        );
        setProblemData(result.data.report);
      }
      setLoading(false);
    } catch (e) {
      toast.error("Không thể lấy được dữ liệu báo cáo");
      console.log(e);
    }
  };
  const exportPDF = () => {
    setExport(true);
    const input = document.getElementById("teacher-report-export");
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

          pdf.save(`${props.email}_teacher_report.pdf`);
        })
        .finally(() => {
          setExport(false);
        });
    } else {
      setExport(false);
    }
  };
  const exportXLSX = () => {
    const data = xlsxData;
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
    <div>
      {(isLoading || isExport) && <LinearProgress />}
      <div className="w-full flex justify-end items-center p-[10px] pb-[0px] space-x-[10px]">
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
      <div id="teacher-report-export" className="w-full h-full p-[10px]">
        <div className="header w-full bg-[#f0ebe8] text-[28px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
          <p>Báo cáo kết quả giảng dạy</p>
          <div className="pdf-display-block mb-[20px] hidden"></div>
        </div>
        <div className="w-full mt-[10px] flex gap-[8px]">
          <div className="flex-1 flex flex-col" style={{ height: "inherit" }}>
            <div className="bg-[#f0ebe8] text-[22px] text-[#6b6b6b] text-center border border-[#d4d4d4]">
              <p>Thông tin chung</p>
              <div className="pdf-display-block mb-[20px] hidden"></div>
            </div>
            <div className="flex items-center border border-[#d4d4d4] flex-1 pt-[20px]">
              <div className="flex-1 h-full flex flex-col">
                <div>
                  <p className="text-[20px] text-[#6b6b6b] text-center text-u">
                    Giảng viên
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                    {user_name}
                  </p>
                </div>
              </div>
              <div className="flex-1 h-full flex flex-col">
                <div>
                  <p className="text-[20px] text-[#6b6b6b] text-center">
                    Số sinh viên quản lý
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[28px] text-[#6b6b6b] text-center pb-[20px]">
                    {stuList.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hide-for-pdf mt-[10px]">
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
            <p>Điểm đạt theo từng bài</p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <HeatMapChart
              data={heatMapData}
              stu_list={stuList}
              loading={isLoading}
            />
          </div>
        </div>

        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Điểm đạt theo từng bài</p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <StuPointChart
              problemData={pointData}
              loading={isLoading}
              problem={stuList}
            />
          </div>
        </div>
        <div>
          <div className="header w-full bg-[#f0ebe8] text-[20px] text-[#6b6b6b] text-center border border-[#d4d4d4] mt-[10px]">
            <p>Trạng thái Submission theo từng bài</p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="border border-[#d4d4d4] border-t-0">
            <StudentSubChart
              loading={isLoading}
              stu_list={stuList}
              accept={accept}
              partial={partial}
              compile={compile}
            ></StudentSubChart>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TeacherReport;
