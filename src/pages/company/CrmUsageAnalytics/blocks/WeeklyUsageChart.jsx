import React from "react";
import Chart from "react-apexcharts";

const WeeklyUsageChart = () => {
    // Dummy data
    const dummyCategories = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const dummyDataAdminSignIns = [50, 60, 55, 65];

    const chartOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false, // Removes unnecessary toolbar
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "40%", // Adjust width for a balanced look
                borderRadius: 4, // Rounded corners
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: dummyCategories, // Labels for the x-axis
            labels: {
                style: {
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            title: {
                text: "Number of Sessions",
                style: {
                    fontSize: "14px",
                },
            },
        },
        colors: ["#4A90E2"], // Single color for uniformity
        grid: {
            borderColor: "#E0E0E0",
        },
        tooltip: {
            enabled: true,
            theme: "light", // Matches the light theme
        },
        title: {
            text: "Weekly Usage Trends",
            align: "left",
            style: {
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
            },
        },
    };

    const chartSeries = [
        {
            name: "Admin Sign-Ins",
            data: dummyDataAdminSignIns,
        },
    ];

    return (
        <div className="chart-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default WeeklyUsageChart;
