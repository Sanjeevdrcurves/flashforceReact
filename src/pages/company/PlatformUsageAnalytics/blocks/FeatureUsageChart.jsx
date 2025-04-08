import React from "react";
import Chart from "react-apexcharts";

const FeatureUsageChart = ({features,featureCounts}) => {
  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 2],
      curve: "smooth",
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      //categories: ["Feature A", "Feature B", "Feature C", "Feature D", "Feature E", "Feature F"],
      categories: features,
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toLocaleString(),
      },
    },
    colors: ["#00C853", "#42A5F5"],
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Usage",
      type: "column",
      //data: [6000, 4000, 3000, 7000, 5000, 6000],
      data: featureCounts,
    },
    {
      name: "Trend",
      type: "line",
      //data: [6000, 4000, 3000, 7000, 5000, 6000],
      data: featureCounts,
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Usage</h3>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default FeatureUsageChart;
