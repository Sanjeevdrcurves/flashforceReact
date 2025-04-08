import React, { Fragment, useEffect, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import { MonitiorLogs } from './blocks/MonitorLogs';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { RecentIndecent } from './blocks/RecentIndecent';
import axios from 'axios';
const SecurityMonitorIncidentReport = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [cardsData, setCardsData] = useState([]);

  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
 // const companyId = 1; // Replace with the dynamic company ID
  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        const response = await axios.get(`${API_URL}/IncidentLogs/GetAllIncidentLogsByCompanyId/${companyId}`);
        const apiData = response.data[0];
        const formattedData = [
          {
            id: 1,
            number: apiData.checkedLog,
            description: "Checked Logs",
            icon: "✅",
            bgColor: "bg-green-200",
            textColor: "text-green-600",
          },
          {
            id: 2,
            number: apiData.warning1,
            description: "Warning 1",
            icon: "ℹ️",
            bgColor: "bg-yellow-200",
            textColor: "text-yellow-600",
          },
          {
            id: 3,
            number: apiData.notes,
            description: "Notes",
            icon: "🔔",
            bgColor: "bg-red-200",
            textColor: "text-red-600",
          },
          {
            id: 4,
            number: apiData.warning2,
            description: "Warning 2",
            icon: "⚠️",
            bgColor: "bg-orange-200",
            textColor: "text-orange-600",
          },
        ];
        setCardsData(formattedData);
      } catch (error) {
        console.error('Error fetching cards data:', error);
      }
    };

    fetchCardsData();
  }, []);

  return (
    <Fragment>
      <PageNavbar />
      <div className="container-fixed">
        {/* Toolbar */}
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">
              Security Monitoring & Incident Report Module
            </h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="text-gray-800">
                Effortless organization for streamlined operations.
              </span>
            </div>
          </ToolbarHeading>
        </Toolbar>

        {/* Main Layout */}
        <div className="flex flex-row ">
          {/* Info Cards Section */}
          <div className="flex flex-col mr-5 gap-3 w-auto ">
            {cardsData.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-4 p-4 rounded-lg shadow bg-white"
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

          {/* Monitoring Logs Section */}
          <div className="flex flex-col  ">
            <MonitiorLogs />
          </div>
        </div>
        <div className={'mt-10 '}>
          <RecentIndecent />
        </div>
      </div>
    </Fragment>
  );
};

export default SecurityMonitorIncidentReport;
