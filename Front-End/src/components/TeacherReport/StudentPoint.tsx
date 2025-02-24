import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const StuPointChart = (props: any) => {
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  );
  const { updateStuEmail } = useAuth();
  const navigate = useNavigate();
  const series = props.problemData.map((el: any) => {
    return ((el.Point / el.Max_point) * 100).toFixed(1);
  });
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          setSelectedColumn(config.dataPointIndex);
        },
      },
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "85%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
      },
      formatter: function (val: number) {
        return `${val}%`;
      },
    },
    colors: ["#0086ff"],
    series: [
      {
        name: "%Điểm đạt được",
        type: "column",
        data: series,
      },
    ],

    xaxis: {
      categories: props.problem,
      labels: {
        rotate: -90,
      },
    },
  };
  const viewStudentReport = (email: string) => {
    updateStuEmail(email);
    navigate("/student_report");
  };

  return (
    <div className="pt-[4px]">
      {selectedColumn !== undefined && (
        <div className="border border-[#d4d4d4] rounded-md m-[4px]  mt-[0px]">
          <div className="border-b-[1px] border-[#d4d4d4] bg-[#edeff1] text-[16px] px-[8px] py-[8px] flex space-x-[8px] items-center">
            <p>{props.problem[selectedColumn]}</p>
            <button
              className="p-[4px] rounded-md text-[#01ec40] border-b-[1px] border-[#d4d4d4] bg-white"
              onClick={() => {
                viewStudentReport(props.problem[selectedColumn]);
              }}
            >
              Xem báo cáo
            </button>
          </div>
          <div className="text-[14px] space-y-[8px] pt-[4px]">
            <div className="flex items-center pl-[16px] py-[4px]">
              <p className="flex-1">{`Điểm đạt được: ${props.problemData[selectedColumn].Point}`}</p>
              <p className="flex-1">{`Điểm của bài thi: ${props.problemData[selectedColumn].Max_point}`}</p>
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

export default StuPointChart;
