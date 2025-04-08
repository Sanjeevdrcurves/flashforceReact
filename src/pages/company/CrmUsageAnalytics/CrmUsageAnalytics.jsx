import React, { Fragment, useState } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading } from "@/partials/toolbar";
import { CommonHexagonBadge } from '@/partials/common';
import FeatureCard from "./blocks/FeatureCard";
import WeeklyUsageChart from "./blocks/WeeklyUsageChart";
import UserAdoptionChart from "./blocks/UserAdoptionChart";
import BarChart from "./blocks/WeeklyUsageChart";

const CrmUsageAnalytics = () => {
    const [chartData, setChartData] = useState([44, 55, 13, 33]);
    const [selectedDuration, setSelectedDuration] = useState("monthly");
    const Cards = [
        {
          title: "Advanced Search",
          subtitle: "Feature Name",
        },
        {
          title: "250 Sessions / 30 days",
          subtitle: "Usage Frequency",
        },
        {
          title: "45 users",
          subtitle: "Active Users",
        },
        {
          title: "75%",
          subtitle: "Adoption Rate",
        },
        {
          title: "30/6",
          subtitle: "Number of Users / Remaining",
        },
      ];
      const chartOptions = {
        labels: ["Product A", "Product B", "Product C", "Product D"],
        colors: ["#1E90FF", "#FFA07A", "#32CD32", "#FFD700"], // Colors for each section
        chart: {
          type: "pie",
        },
      };
      const timeRangeOptions = [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Yearly", value: "yearly" },
      ];
      const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
    
        // Update chartData based on the selected time range (dummy logic)
        switch (event.target.value) {
          case "daily":
            setChartData([10, 20, 15, 5]);
            break;
          case "weekly":
            setChartData([30, 40, 20, 10]);
            break;
          case "monthly":
            setChartData([44, 55, 13, 33]);
            break;
          case "yearly":
            setChartData([100, 120, 80, 50]);
            break;
          default:
            setChartData([44, 55, 13, 33]);
        }
      };
  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
              CRM Feature Usage Analytics
            </h1>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ToolbarHeading>
        </Toolbar>
        <div className="flex gap-4 p-4 bg-white-50  w-full">

{Cards.map((res)=>(
    <FeatureCard subtitle={res.title} title={res.subtitle}/>
))}
        </div>
        <div className="flex gap-2 p-4 bg-white-50 w-full">
  <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
    <WeeklyUsageChart />
  </div>
  <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
  <UserAdoptionChart
    title="User Adoption"
    subtitle="Monthly Data"
    chartData={chartData}
    chartOptions={chartOptions}
    timeRangeOptions={timeRangeOptions}
    value={selectedDuration}
    onDurationchange={handleDurationChange}
  />
</div>
</div>
      </div>
    </Fragment>
  );
};

export default CrmUsageAnalytics;
