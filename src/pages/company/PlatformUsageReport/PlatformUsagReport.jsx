import React, { Fragment, useEffect, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { FutureTabel } from './blocks/FutureTabel';
import { DatePicker } from '@mui/x-date-pickers';
// import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useSelector } from 'react-redux';
const PlatformUsageReports = () => {
    const { userId, companyId } = useSelector(state => state.AuthReducerKey);
    const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
    //const companyId = 1; // Replace with the dynamic company ID
    const [userActivities, setUserActivities] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchAllUserActivity();
    }, [startDate, endDate]);

    const fetchAllUserActivity = async () => {
        var nietos = [];
        try {
            const response = await axios.get(`${API_URL}/UserActivity/GetAllUserActivityByCompany`, {
                params: {
                    companyId: companyId,
                    startDate: startDate ? formatDateToYYYYMMDD(startDate) : '',
                    endDate: endDate ? formatDateToYYYYMMDD(endDate) : ''
                },
            });
            console.log('AllUserActivityByCompany Response:', response.data);
            var tmp = response.data;
            if (tmp && tmp.length) {
                tmp.map((item, index) => {
                    let date = new Date(item.activityTimestamp);
                    var atime = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);

                    var obj = {
                        id: item.id,
                        timestamp: atime,
                        user: item.createBy,
                        activityType: item.activityType,
                        description: item.description ? item.description : '',
                    }
                    nietos.push(obj);
                });
                setUserActivities(nietos);
            }
        } catch (error) {
            console.error('Error fetching engagement graph data:', error);
        }
    };

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
        return `${year}-${month}-${day}`;
    };
    return (
        <Fragment>
            <PageNavbar />
            <div className="container-fixed">
                {/* Toolbar */}
                <Toolbar>
                    <ToolbarHeading>
                        <h1 className="text-xl font-medium leading-none text-gray-900">
                            Platform Usage Analytics Report
                        </h1>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <span className="text-gray-800">
                                Effortless organization for streamlined operations.
                            </span>
                        </div>
                    </ToolbarHeading>
                </Toolbar>
                <div className="flex items-end gap-4 p-4  rounded-lg mb-10">
                    {/* Date Range */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-3">Date Range</label>
                        <div className="flex gap-2">
                            <div className="relative">
                                {/* <input
              type="text"
              placeholder="Date Range"
              className="w-full border border-gray-300 rounded-md p-2 pl-10 text-sm text-gray-700"
            /> */}
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                                <div className="absolute left-3 top-2.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="relative">
                                {/* <input
              type="text"
              placeholder="Date Range"
              className="w-full border border-gray-300 rounded-md p-2 pl-10 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            /> */}
                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                                <div className="absolute left-3 top-2.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Type */}
                    {/* <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-3">User Type</label>
        <input
          type="text"
          placeholder="User Type"
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div> */}

                    {/* Activity Type */}
                    {/* <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-3">Activity Type</label>
        <input
          type="text"
          placeholder="Activity Type"
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
      </div> */}

                    {/* Submit Button */}
                    {/* <div className="flex items-end">
        <button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600">
          Submit
        </button>
      </div> */}
                </div>
                <FutureTabel userActivities={userActivities} />
            </div>
        </Fragment>
    );
};

export default PlatformUsageReports;
