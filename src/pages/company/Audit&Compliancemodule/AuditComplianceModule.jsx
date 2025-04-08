import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import Chart from "react-apexcharts";
import { KeenIcon } from '@/components';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import Piechart from './Piechart';
import { SecurityLog } from './SecurityLog';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID
const AuditComplianceModule = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [searchInput, setSearchInput] = useState('');
  const [pieChartData1, setPieChartData1] = useState([0, 0, 0]); // First chart (Attempt, Failed, Success)
  const [pieChartData2, setPieChartData2] = useState([0, 0, 0, 0]); // Second chart (Admin, User, Patient, Doctor)
  const [pieChartData3, setPieChartData3] = useState([0, 0]); // Third chart (Attempt, Failed)
  const [timeFilter1, setTimeFilter1] = useState(null); // Time filter for first pie chart
  const [timeFilter2, setTimeFilter2] = useState(null); // Time filter for second pie chart
  const [timeFilter3, setTimeFilter3] = useState(null); // Time filter for third pie chart
  const [chartData, setChartData] = useState([]); // For chart data (success, failed, warning)
  const [infoCardData, setInfoCardData] = useState({ success: 0, failed: 0, warning: 0 }); // For info cards
  const cardsData = [
    {
      id: 1,
      number: infoCardData.success,
      description: "Successful Logins",
      icon: "✅",
      bgColor: "bg-green-200",
      textColor: "text-green-600",
    },
    {
      id: 2,
      number: infoCardData.failed,
      description: "Failed Logins",
      icon: "ℹ️",
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-600",
    },
    {
      id: 3,
      number: infoCardData.warning,
      description: "Warnings",
      icon: "🔔",
      bgColor: "bg-red-200",
      textColor: "text-red-600",
    },
  ];
  const[eventChartValue,seteventChartValue]=useState(12)

  const chartOptions = {
    chart: {
      id: "basic-line-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: chartData.map(item => `${item.hourOfDay} PM`), // Create hours from API data
    },
    yaxis: {
      labels: {
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
    colors: ["#3b82f6", "#F5B7B1", "#FF6347"], // For Success, Failed, Warning
  };

  // const chartSeries = [
  //   {
  //     name: "Success",
  //     data: chartData.map(item => item.success),
  //   },
  //   {
  //     name: "Failed",
  //     data: chartData.map(item => item.failed),
  //   },
  //   {
  //     name: "Warning",
  //     data: chartData.map(item => item.warning),
  //   },
  // ];
 // Function to fetch data
 const fetchChartData = async () => {
  try {
    const response = await axios.get( `${API_URL}/SecurityIncident/GetLoginLogsForHourlyGraph`, {
      params: { timeFilter: eventChartValue, companyId: `${companyId}` ,userId:`${userId}`},
    });

    if (response.data && response.data.length > 0) {
      setChartData(response.data);
      
      // Update info cards with total success, failed, and warnings from the first record
      const firstRecord = response.data[0];
      setInfoCardData({
        success: firstRecord.success,
        failed: firstRecord.failed,
        warning: firstRecord.warning,
      });
    }
    else{
      setChartData([]);

    }
  } catch (error) {
    console.error("Error fetching chart data", error);
  }
};

  // Function to fetch pie chart data based on time filter
  const fetchPieChartData = async (timeFilter, chartIndex) => {
    try {
      const response = await axios.get(`${API_URL}/SecurityIncident/GetLoginGraphDetailsByCompanyId`, {
        params: { timeFilter, companyId: `${companyId}` ,userId:`${userId}`}
      });

      if (response.data && response.data.length > 0) {
        const data = response.data[chartIndex];

        if (chartIndex === 0) {
          const successfulCount = data.find(item => item.C1Status === 'success')?.C1Statuscount || 0;
          const failedCount = data.find(item => item.C1Status === 'failed')?.C1Statuscount || 0;
          const attemptCount = data.find(item => item.C1Status === 'attempt')?.C1Statuscount || 0;
          setPieChartData1(
            successfulCount === 0 && failedCount === 0 && attemptCount === 0
              ? []
              : [successfulCount, failedCount, attemptCount]
          );
        } else if (chartIndex === 1) {
          const adminCount = data.find(item => item.RoleName === 'Admin')?.C2StatusCount || 0;
          const userCount = data.find(item => item.RoleName === 'User')?.C2StatusCount || 0;
          const patientCount = data.find(item => item.RoleName === 'Patient')?.C2StatusCount || 0;
          const doctorCount = data.find(item => item.RoleName === 'Doctor')?.C2StatusCount || 0;
        
          setPieChartData2(
            adminCount === 0 && userCount === 0 && patientCount === 0 && doctorCount===0
              ? []
              : [adminCount, userCount, patientCount,doctorCount]
          );
        } else if (chartIndex === 2) {
          const failedCount = data.find(item => item.C3Status === 'Failed')?.C3Statuscount || 0;
          const attemptCount = data.find(item => item.C3Status === 'Attempt')?.C3Statuscount || 0;
          setPieChartData3([attemptCount, failedCount]);
          setPieChartData3(
            failedCount === 0 && attemptCount === 0 
              ? []
              : [failedCount, attemptCount]
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data for PieChart", error);
    }
  };

  // Fetch data for all pie charts whenever time filters change
  useEffect(() => {
    fetchPieChartData(timeFilter1, 0); // Fetch data for Pie Chart 1
  }, [timeFilter1]);

  useEffect(() => {
    fetchPieChartData(timeFilter2, 1); // Fetch data for Pie Chart 2
  }, [timeFilter2]);

  useEffect(() => {
    fetchPieChartData(timeFilter3, 2); // Fetch data for Pie Chart 3
  }, [timeFilter3]);

  // Handle change for time filter on PieChart 1
 

  // Handle change for time filter on PieChart 2
  const handleTimeFilterChange2 = (event) => {
    console.log("Time Filter 2 changed:", event.target.value);
    setTimeFilter2(event.target.value);
  };

  // Handle change for time filter on PieChart 3
  const handleTimeFilterChange3 = (event) => {
    console.log("Time Filter 3 changed:", event.target.value);
    setTimeFilter3(event.target.value);
  };
  const chartSeries = [
    {
      name: "LoginCount",
      data: chartData.map(item => `${item.loginCount}`),
      // data: [30, 20, 15, 25, 35, 25, 40, 30],
    },
  ];
  useEffect(() => {
    fetchChartData(); // Fetch the data on component mount
  }, [eventChartValue]);

const userFailhandler=(val)=>{
  setTimeFilter1(val.target.value);
  
  
  // alert(JSON.stringify(val))
}
const  eventChartHandler =(val)=>{
  seteventChartValue(val.target.value);
}

  return (
    <Fragment>
      <PageNavbar />
      <div className="container-fixed">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">Audit & Compliance Module</h1>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-800 font-medium">Effortless organization for streamlined operations.</span>
              </div>
            </div>
          </ToolbarHeading>
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input type="text" placeholder="Type name, team" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
            </label>
          </div>
        </Toolbar>

       
        
        <div className="flex flex-row gap-6 p-6">
          {/* Info Cards Section */}
          <div className="flex flex-col gap-6 w-1/2">
            {cardsData.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-4 p-4 rounded-lg shadow bg-white h-28"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded ${card.bgColor}`}
                >
                  <span className={`text-2xl ${card.textColor}`}>{card.icon}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{card.number}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
 {/* Chart Section */}
 <div className="flex flex-col w-2/3 bg-white p-4 rounded-lg shadow h-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Events</h3>
          <select defaultValue={'12'} onChange={eventChartHandler} className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value='12'>12 Hours</option>
            <option value='24'>24 Hours</option>
            <option value='84'>7 Days</option>
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
    </div>
   

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Pie Charts Section */}
          <Piechart
            title="User Failure by User Type"
            subtitle="Summary of successful and failed attempts"
            chartData={pieChartData1}
            chartOptions={{
              labels: ["Successful", "Failed", "Attempt"],
              colors: ["#A2D9CE", "#F5B7B1", "#F9E79F"],
            }}
            value={'12'}
            timeRangeOptions={[{label:"12 Hours",value:'12'},{label:"24 Hours",value:'24'} ,{label:"7 Days",value:'84'} ]}
            onDurationchange={userFailhandler}
            timeFilter={timeFilter1}
            type="donut"
          />
          <Piechart
            title="Login User Types"
            subtitle="Summary of user roles"
            chartData={pieChartData2}
            chartOptions={{
              labels: ["Admin", "User", "Patient", "Doctor"],
              colors: ["#87CEEB", "#9FE2BF", "#FFC300", "#FF6347"],
            }}
            value={'12'}
            onDurationchange={handleTimeFilterChange2}
            timeRangeOptions={[{label:"12 Hours",value:'12'},{label:"24 Hours",value:'24'} ,{label:"7 Days",value:'84'} ]}
            timeFilter={timeFilter2}
           
            type="donut"
          />
          <Piechart
            title="User Login Attempts"
            subtitle="Summary of login attempts"
            chartData={pieChartData3}
            chartOptions={{
              labels: ["Attempt", "Failed"],
              colors: ["#CF9FFF", "#A2D9CE"],
            }}
            value={'12'}
            onDurationchange={handleTimeFilterChange3}
            timeRangeOptions={[{label:"12 Hours",value:'12'},{label:"24 Hours",value:'24'} ,{label:"7 Days",value:'84'} ]}
            timeFilter={timeFilter3}
            type="pie"
          />
        </div>

        <SecurityLog />
      </div>
    </Fragment>
  );
};

export default AuditComplianceModule;
