import React from "react";
import Chart from "react-apexcharts";

const UserAdoptionChart = ({
  title,
  subtitle,
  chartData,
  chartOptions,
  timeRangeOptions = [],
  type = "pie",
  value,
  onDurationchange
}) => {
  const updatedChartOptions = {
    ...chartOptions,
    chart: {
      ...chartOptions.chart,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
            total: {
              show: false,
              label: "Total",
              fontSize: "10px",
              fontWeight: 600,
              color: "#000",
              formatter: () => chartData.reduce((a, b) => a + b, 0),
            },
          },
        },
        dataLabels: {
          offset: 0,
          // minAngleToShowLabel: 10,
        },
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "13px",
        fontWeight: "600",
        colors: ["#fff"],
      },
    },
    legend: {
      show: false,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 10,
        height: 10,
        radius: 10,
      },
      labels: {
        colors: ["#333"],
        useSeriesColors: false,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val, opts) => `${val} (${((val / opts.seriesTotals) * 100).toFixed(1)}%)`,
      },
    },
    colors: chartOptions.colors,
  };

  return (
    <div className="bg-white   w-full  ">
    {/* Header Section */}
    <div className="flex items-center mb-4 p-3">
        <p className="text-xs text-gray-800 font-semibold">{title}</p>
    </div>
          <div className="flex  w-full" >
       { chartData?.length?  <Chart
        options={updatedChartOptions}
        series={chartData}
        type={type}
        height={350}
        width={300}
      />:<span>No data found</span>}
          </div>
    {/* Chart Section */}
      
  </div>


  );
};

export default UserAdoptionChart;
