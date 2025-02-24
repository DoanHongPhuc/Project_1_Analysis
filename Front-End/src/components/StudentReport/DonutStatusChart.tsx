import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const DonutStatusChart = (props: any) => {
  const series: number[] = props.series;
  const total = series.reduce((acc, val) => acc + val, 0);
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#ff1652", "#ffb01a", "#775dd0", "#0086ff", "#01ec93"],
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Tổng",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    labels: ["Chưa làm", "Yếu", "Trung bình", "Tốt", "Hoàn thành"],
    legend: {
      position: "right",
      offsetY: 0,
      height: 200,
      customLegendItems: [
        `Chưa làm:   ${series[0]}/${total}`,
        `Yếu:        ${series[1]}/${total}`,
        `Trung bình: ${series[2]}/${total}`,
        `Tốt:        ${series[3]}/${total}`,
        `Hoàn thành: ${series[4]}/${total}`,
      ],
    },
  };

  return (
    <div>
      {!props.loading && (
        <div className="border border-[#d4d4d4] border-t-0">
          <Chart options={options} series={series} type="donut" height={200} />
        </div>
      )}
      {props.loading && (
        <div className="border border-[#d4d4d4] border-t-0">
          <Chart options={options} series={series} type="donut" height={200} />
        </div>
      )}
    </div>
  );
};

export default DonutStatusChart;
