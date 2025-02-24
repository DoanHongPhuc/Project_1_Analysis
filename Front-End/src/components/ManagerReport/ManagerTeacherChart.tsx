import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
const ManagerTeacherChart = (props: any) => {
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  );
  const options: ApexOptions = {
    chart: {
      type: "bar",
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
      width: [0, 4],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
    },
    colors: ["#0086ff", "#01ec93"],
    series: [
      {
        name: "Số học sinh",
        type: "column",
        data: props.data1,
      },
      {
        name: "Qua môn",
        type: "line",
        data: props.data2,
      },
    ],
    xaxis: {
      categories: props.teacher,
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
          <div className="border-b-[1px] border-[#d4d4d4] bg-[#edeff1] text-[16px] px-[8px] py-[8px]">
            <p>{props.teacher[selectedColumn]}</p>
          </div>
          <div className="text-[14px] space-y-[8px] pt-[4px]">
            <div className="flex items-center pl-[16px] py-[4px]">
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#01ec93] mr-[6px]"></div>
                <p className="">{`Số học sinh quản lý: ${props.data1[selectedColumn]}`}</p>
              </div>
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#0086ff] mr-[6px]"></div>
                <p>{`Số học sinh qua môn: ${props.data2[selectedColumn]}`}</p>
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

export default ManagerTeacherChart;
