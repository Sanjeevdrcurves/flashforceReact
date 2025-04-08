import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
import { useSelector } from 'react-redux';


const BarChart = ({ timeFilter ,selectedCompanyId}) => {
    const [chartSeries, setChartSeries] = useState([]);
    const [chartCategories, setChartCategories] = useState([]);
    const {userId, companyId} = useSelector(state => state.AuthReducerKey);
    const chartOptions = {
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                columnWidth: "20%", // Reduce column width for spacing
                barHeight: "70%", // Applies to vertical bar charts
                borderRadius: 5,
                distributed: false, // Ensure grouping by series
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: chartCategories, // Dynamically updated categories
            labels: {
                show: true,
            },
        },
        colors: ["#00C853", "#E0E0E0"], // Green for main bars, Grey for background bars
        yaxis: {
            title: {
                text: "Count",
            },
        },
        grid: {
            borderColor: "#f1f1f1",
        },
        tooltip: {
            enabled: true,
        },
        legend: {
            position: "top",
        },
    };
   
    useEffect(() => {
        // Fetch data from API
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/Session/GetSignInGraphDataByCompanyId/${selectedCompanyId}/${userId}?timeFilter=${timeFilter}`); // Replace with your actual API endpoint
                const data = response.data;

                // Process the response to extract categories and series data
                const categories = data.map((item) => item.monthName);
                const adminSignIns = data.map((item) => item.adminSignIns);
                const failedAttempts = data.map((item) => item.failedAttemptsSessionCount);
// console.log(categories);
                setChartCategories(categories);
                setChartSeries([
                    {
                        name: "Admin Sign-Ins",
                        data: adminSignIns,
                    },
                    {
                        name: "Failed Attempts",
                        data: failedAttempts,
                    },
                ]);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();
    }, [timeFilter,selectedCompanyId]);

    return (
        <div className="chart-container">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default BarChart;
