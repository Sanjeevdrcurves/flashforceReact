import { Fragment } from 'react';
import Chart from "react-apexcharts";

const Userengagement = ({userEngagementTimelines, userEngagementCounts}) => {
    const chartOptions = {
        chart: {
          id: "basic-line-chart",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          // categories: ["1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"],
          categories: userEngagementTimelines,
        },
        yaxis: {
          labels: {
            //formatter: (value) => `${value}k`,
            formatter: (value) => `${value}`,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        colors: ["#3b82f6"],
      };
      const chartSeries = [
        {
          name: "Events",
          //data: [30, 20, 15, 25, 35, 25, 40, 30],
          data: userEngagementCounts,
        },
      ];
  return (

<div className="flex flex-col w-full bg-white p-4 rounded-lg shadow h-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            {/* <option>12 Hours</option>
            <option>24 Hours</option>
            <option>7 Days</option> */}
            <option>12 Months</option>
          </select>
        </div>
        <div className="flex-1">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height="300"
          />
        </div>
      </div>
  )
};
export { Userengagement };