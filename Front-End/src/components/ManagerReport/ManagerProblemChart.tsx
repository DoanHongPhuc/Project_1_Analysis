import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
const ManagerProblemChart = (props: any) => {
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>(
    undefined
  );

  const options1: ApexOptions = {
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#ff1652", "#ffb01a", "#775dd0", "#0086ff", "#01ec93"],
    series: [
      {
        name: "Chưa Làm",
        type: "column",
        data: props.status_0,
      },
      {
        name: "Yếu",
        type: "column",
        data: props.status_1,
      },
      {
        name: "Trung Bình",
        type: "column",
        data: props.status_2,
      },
      {
        name: "Tốt",
        type: "column",
        data: props.status_3,
      },
      {
        name: "Hoàn Thành",
        type: "column",
        data: props.status_4,
      },
    ],
    xaxis: {
      categories: props.list,
      labels: {
        rotate: -90,
        formatter: function (value: string) {
          if (value.length > 10) {
            return value.slice(0, 10) + "...";
          }
          return value;
        },
      },
    },
  };
  const options2: ApexOptions = {
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
      },

      formatter: function (value: string) {
        return value + "%";
      },
    },
    colors: ["#0086ff"],
    series: [
      {
        name: "Phần trăm điểm",
        type: "column",
        data: props.point,
      },
    ],
    xaxis: {
      categories: props.list,
      labels: {
        rotate: -90,
        formatter: function (value: string) {
          if (value.length > 10) {
            return value.slice(0, 10) + "...";
          }
          return value;
        },
      },
    },
  };

  return (
    <div className="pt-[4px]">
      {selectedColumn !== undefined && (
        <div className="border border-[#d4d4d4] rounded-md m-[4px]  mt-[0px]">
          <div className="border-b-[1px] border-[#d4d4d4] bg-[#edeff1] text-[16px] px-[8px] py-[8px] flex space-x-[8px] items-center">
            <p>{props.list[selectedColumn]}</p>
          </div>
          <div className="text-[14px] space-y-[8px] pt-[4px]">
            <div className="flex items-center pl-[16px] py-[4px]">
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#ff1652] mr-[6px]"></div>
                <p className="">{`Chưa làm: ${props.status_0[selectedColumn]}`}</p>
              </div>
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#ffb01a] mr-[6px]"></div>
                <p>{`Yếu: ${props.status_1[selectedColumn]}`}</p>
              </div>
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#775dd0] mr-[6px]"></div>
                <p>{`Trung Bình: ${props.status_2[selectedColumn]}`}</p>
              </div>
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#0086ff] mr-[6px]"></div>
                <p>{`Tốt: ${props.status_3[selectedColumn]}`}</p>
              </div>
              <div className="flex items-center flex-1">
                <div className="h-[12px] w-[12px] rounded-[12px] bg-[#01ec93] mr-[6px]"></div>
                <p>{`Hoàn thành: ${props.status_4[selectedColumn]}`}</p>
              </div>
            </div>
            <div className="flex items-center pl-[16px] py-[4px]">
              <div className="flex items-center flex-1">
                <p className="flex-1">{`Phần trăm điểm trung bình: ${props.point[selectedColumn]}%`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {!props.loading && (
        <div className="space-y-[10px]">
          <Chart
            options={options1}
            series={options1.series}
            type="bar"
            height={350}
          />
          <Chart
            options={options2}
            series={options2.series}
            type="bar"
            height={350}
          />
        </div>
      )}
      {props.loading && (
        <div className="space-y-[10px]">
          <Chart
            options={options1}
            series={options1.series}
            type="bar"
            height={350}
          />
          <Chart
            options={options2}
            series={options2.series}
            type="bar"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ManagerProblemChart;
