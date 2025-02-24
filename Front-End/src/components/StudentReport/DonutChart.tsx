import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const DonutChart = (props: any) => {
  const series: number[] = props.series;
  const total = series.reduce((acc, val) => acc + val, 0);
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#01ec93", "#0086ff", "#ff1652"],
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
    labels: ["Accept", "Partial", "Compile Error"],
    legend: {
      position: "right",
      offsetY: 0,
      height: 100,
      customLegendItems: [
        `Accept:   ${series[0]}/${total}`,
        `Partial:        ${series[1]}/${total}`,
        `Compile Error: ${series[2]}/${total}`,
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

export default DonutChart;
