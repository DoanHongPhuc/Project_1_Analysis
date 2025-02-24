import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
const StudentSubChart = (props: any) => {
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  );
  const { updateStuEmail } = useAuth();
  const navigate = useNavigate();
  const viewStudentReport = (email: string) => {
    updateStuEmail(email);
    navigate("/student_report");
  };
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          setSelectedColumn(config.dataPointIndex);
        },
      },
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          customIcons: [],
        },
        autoSelected: "zoom",
      },
    },
    stroke: {
      width: [0, 0, 0],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1, 2],
    },
    colors: ["#01ec93", "#0086ff", "#ff1652"],
    series: [
      {
        name: "Accept",
        type: "column",
        data: props.accept,
      },
      {
        name: "Partial",
        type: "column",
        data: props.partial,
      },
      {
        name: "Compile Error",
        type: "column",
        data: props.compile,
      },
    ],
    xaxis: {
      categories: props.stu_list,
      labels: {
        rotate: -90,
      },
    },
    legend: {
      position: "top",
    },
  };

  return (
    <div className="pt-[4px]">
      {selectedColumn !== undefined && (
        <div className="border border-[#d4d4d4] rounded-md m-[4px]  mt-[0px]">
          <div className="border-b-[1px] border-[#d4d4d4] bg-[#edeff1] text-[16px] px-[8px] py-[8px] flex space-x-[8px] items-center">
            <p>{props.stu_list[selectedColumn]}</p>
            <button
              className="p-[4px] rounded-md text-[#01ec40] border-b-[1px] border-[#d4d4d4] bg-white"
              onClick={() => {
                viewStudentReport(props.stu_list[selectedColumn]);
              }}
            >
              Xem báo cáo
            </button>
          </div>
          <div className="text-[14px] space-y-[8px] pt-[4px]">
            <div className="flex items-center pl-[16px] py-[4px]">
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#01ec93] mr-[6px]"></div>
                <p className="">{`Số Accept Submission: ${props.accept[selectedColumn]}`}</p>
              </div>
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#0086ff] mr-[6px]"></div>
                <p>{`Số Partial Submission: ${props.partial[selectedColumn]}`}</p>
              </div>
            </div>
            <div className="flex items-center pl-[16px] py-[4px]">
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#ff1652] mr-[6px]"></div>
                <p className="flex-1">{`Số Compile Error Submission: ${props.compile[selectedColumn]}`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {!props.loading && (
        <Chart
          options={options}
          series={options.series}
          type="bar"
          height={350}
        />
      )}
      {props.loading && (
        <Chart
          options={options}
          series={options.series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default StudentSubChart;
