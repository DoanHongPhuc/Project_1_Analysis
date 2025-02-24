import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const Histogram = (props: any) => {
  const [data, setData] = useState<number[]>(props.data);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#fff",
        opacity: 0.9,
      },
    },
    xaxis: {
      type: "numeric",
      tickAmount: 10,
      labels: {
        formatter: (value: string) => `${value}%`,
      },
    },
    yaxis: {
      title: {
        text: "Số sinh viên ",
      },
    },
    noData: {
      text: "Loading...",
    },
  };

  // Prepare series data for histogram
  const series = [
    {
      name: "Frequency",
      data: calculateHistogram(props.data, 10), // Calculate histogram data
    },
  ];

  // Function to calculate histogram data
  function calculateHistogram(
    data: number[],
    bins: number
  ): { x: string; y: number }[] {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const binSize = (max - min) / bins;
    let histogramData = new Array(bins).fill(0);

    data.forEach((value) => {
      const index = Math.floor((value - min) / binSize);
      if (index === bins) {
        // In case value is the maximum
        histogramData[bins - 1]++;
      } else {
        histogramData[index]++;
      }
    });

    return histogramData.map((count, index) => ({
      x: `${(min + index * binSize).toFixed(0)}-${(
        min +
        (index + 1) * binSize
      ).toFixed(0)}`,
      y: count,
    }));
  }

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default Histogram;
