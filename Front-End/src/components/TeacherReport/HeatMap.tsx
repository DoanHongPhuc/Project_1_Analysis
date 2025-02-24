import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const HeatMapChart = (props: any) => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "heatmap",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#008FFB"],
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="border-b-[1px] border-[#d4d4d4]">' +
          "<div class='px-[8px] py-[4px] bg-[#edeff1]'>" +
          props.data[seriesIndex][dataPointIndex].problem_Name +
          "</div>" +
          "<div class='px-[8px] py-[4px]'>" +
          "%Điểm đạt được: " +
          (
            (props.data[seriesIndex][dataPointIndex].point /
              props.data[seriesIndex][dataPointIndex].max_point) *
            100
          ).toFixed(1) +
          "%" +
          "</div>" +
          "<div class='px-[8px] py-[4px]'>" +
          "Điểm đạt được: " +
          props.data[seriesIndex][dataPointIndex].point +
          "</div>" +
          "<div class='px-[8px] py-[4px]'>" +
          "Điểm của bài thi: " +
          props.data[seriesIndex][dataPointIndex].max_point +
          "</div>" +
          "</div>"
        );
      },
    },
  };

  // Tạo dữ liệu mẫu
  const series = props.stu_list.map((name: any, index: any) => {
    const data = props.data[index].map((el: any) => {
      return {
        x: el.index,
        y: ((el.point / el.max_point) * 100).toFixed(1),
      };
    });
    return {
      name: name,
      data: data,
    };
  });

  return (
    <div id="chart">
      {!props.loading && (
        <ReactApexChart
          options={options}
          series={series}
          type="heatmap"
          height={100 + props.stu_list.length * 100}
        />
      )}
      {props.loading && (
        <ReactApexChart
          options={options}
          series={series}
          type="heatmap"
          height={350}
        />
      )}
    </div>
  );
};

export default HeatMapChart;
