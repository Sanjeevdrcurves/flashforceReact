import React, { Fragment, useState, useEffect } from "react";
import { LoginSession } from "./blocks";
import BarChart from "./blocks/BarChart";
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { Container } from '@/components/container';
import { useSelector } from 'react-redux';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const Usagetracking = () => {
    const {userId, companyId} = useSelector(state => state.AuthReducerKey);
    const [sidenavWidth, setSidenavWidth] = useState("0");
    const [mainMarginLeft, setMainMarginLeft] = useState("0");
    const [usageData, setUsageData] = useState({
        userSignIns: 0,
        adminSignIns: 0,
        failedAttempts: 0
    });
   
    const [timeFilter, setTimeFilter] = useState("12"); // Default to '7 Day'
    const [selectedCompanyId, setSelectedCompanyId] = useState("0"); // Default to "0" for all companies
    
    const [companies, setCompanies] = useState([]);

    const getAllCompanies = async () => {
        try {
          const response = await axios.get(`${API_URL}/Company/all`);
          setCompanies(response.data);
          console.log(JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching companies:", error.message);
        }
      };
    
      useEffect(() => {
        getAllCompanies();
      }, []);


    // // Function to fetch usage data from the API
    // const fetchUsageData = async (filter) => {
    //     try {
    //         const response = await fetch(`${API_URL}/Session/GetUsageTrackingByCompanyId/${companyId}/${userId}?timeFilter=${filter}`);
    //         const data = await response.json();
    //         setUsageData({
    //             userSignIns: data.userSignIns,
    //             adminSignIns: data.adminSignIns,
    //             failedAttempts: data.failedAttempts
    //         });
    //     } catch (error) {
    //         console.error("Error fetching usage data:", error);
    //     }
    // };

    const fetchUsageData = async (filter, companyId) => {
        try {
            const response = await fetch(`${API_URL}/Session/GetUsageTrackingByCompanyId/${companyId}/${userId}?timeFilter=${filter}`);
            const data = await response.json();
            setUsageData({
                userSignIns: data.userSignIns,
                adminSignIns: data.adminSignIns,
                failedAttempts: data.failedAttempts
            });
        } catch (error) {
            console.error("Error fetching usage data:", error);
        }
    };

// Function to handle company selection change
const handleInputChange = (event) => {
    const newCompanyId = event.target.value;
    setSelectedCompanyId(newCompanyId);
    fetchUsageData(timeFilter, newCompanyId); // Fetch data with updated companyId
};
    // Fetch the data whenever the timeFilter changes
    useEffect(() => {
        fetchUsageData(timeFilter, selectedCompanyId);
    }, [timeFilter, selectedCompanyId]);
    
    const toggleNav = () => {
        if (sidenavWidth === "0") {
            // Open the drawer
            setSidenavWidth("250px");
            if (window.innerWidth >= 768) {
                setMainMarginLeft("250px"); // Shift content only on larger screens
            } else {
                setMainMarginLeft("250px"); // For mobile devices, shift content
            }
        } else {
            // Close the drawer
            setSidenavWidth("0");
            setMainMarginLeft("0");
        }
    };

    const closeNav = () => {
        setSidenavWidth("0");
        setMainMarginLeft("0");
    };

    const styles = {
        body: {
            fontFamily: '"Lato", sans-serif',
        },
        sidenav: {
            height: "100%",
            width: sidenavWidth,
            position: "fixed",
            zIndex: 1,
            top: "70px", // Desktop default
            left: "270px", // Desktop default

            overflowX: "hidden",
            transition: "0.5s",
            paddingTop: "60px",
        },
        sidenavMobile: {
            top: 0, // For mobile devices
            left: 0, // For mobile devices
        },
        sidenavLink: {
            padding: "8px 8px 8px 32px",
            textDecoration: "none",
            fontSize: "25px",
            color: "#818181",
            display: "block",
            transition: "0.3s",
        },
        sidenavLinkHover: {
            color: "#f1f1f1",
        },
        closebtn: {
            position: "absolute",
            top: 0,
            right: "25px",
            fontSize: "36px",
            marginLeft: "50px",
            marginTop: "20px",
        },
        main: {
            transition: "margin-left 0.5s",
            padding: "16px",
            marginLeft: mainMarginLeft,
        },
        openBtn: {
            fontSize: "30px",
            cursor: "pointer",
        },
    };

    // Combine desktop and mobile styles based on screen width
    const mergedSidenavStyles =
        window.innerWidth < 768
            ? { ...styles.sidenav, ...styles.sidenavMobile }
            : styles.sidenav;
            const handleFilterClick = (filter) => {
                setTimeFilter(filter); // Set the clicked filter as active
              };
    return (
        <div className="container-fixed m-0 w-full">
            <Container>
                <Fragment>
                    <Toolbar>
                        <ToolbarHeading>
                            <h1 className="text-xl font-medium leading-none text-gray-900">Usage Tracking</h1>
                            <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className="text-gray-800 font-medium">Central Hub for Personal Customization</span>
                                </div>
                            </div>
                        </ToolbarHeading>
                        <ToolbarActions>
                            {/* <a href="#" className="btn btn-sm btn-light">
                                Billing
                            </a> */}
                        </ToolbarActions>
                    </Toolbar>

                    <div style={styles.body} id="Usagetracking">
                        <div id="mySidenav" style={mergedSidenavStyles} className="sidebar bg-light lg:border-e lg:border-e-gray-200 dark:border-e-coal-100 lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0 dark:bg-coal-600">
                            <a href="javascript:void(0)" style={styles.closebtn} onClick={closeNav}>
                                &times;
                            </a>
                            <a href="#" style={styles.sidenavLink}>About</a>
                            <a href="#" style={styles.sidenavLink}>Services</a>
                            <a href="#" style={styles.sidenavLink}>Clients</a>
                            <a href="#" style={styles.sidenavLink}>Contact</a>
                        </div>

                        <div id="main" style={styles.main}>
                            {/* <span style={styles.openBtn} onClick={toggleNav}>
                                &#9776; {sidenavWidth === "0" ? "Open" : "Close"}
                            </span> */}

                            <div className="card w-full">
                                <div className="card-header">
      <h3 className="card-title">Usage Details</h3>
      <div className="flex items-baseline gap-2.5">
            <label className="form-label">Select Company</label>
            <select name="relationshipNumber" onChange={handleInputChange} className="input" value={selectedCompanyId}>
                <option value="0">All Companies</option>
                {companies.map((company) => (
                    <option key={company.companyId} value={company.companyId}>
                        {company.companyName}
                    </option>
                ))}
            </select>
        </div>
      <div className="flex gap-4 text-sm font-medium text-gray-600">
        <span
          className={`cursor-pointer ${timeFilter === "12" ? "text-green-600" : ""}`}
          onClick={() => handleFilterClick("12")}
        >
          12 Hours
        </span>
        <span
          className={`cursor-pointer ${timeFilter === "24" ? "text-green-600" : ""}`}
          onClick={() => handleFilterClick("24")}
        >
          Day
        </span>
        <span
          className={`cursor-pointer ${timeFilter === "84" ? "text-green-600" : ""}`}
          onClick={() => handleFilterClick("84")}
        >
          Week
        </span>
        <span
          className={`cursor-pointer ${timeFilter === "8760" ? "text-green-600" : ""}`}
          onClick={() => handleFilterClick("8760")}
        >
          Year
        </span>
      </div>
    </div>

    {/* <div className="card-header">
                                    <h3 className="card-title">Usage Details</h3>
                                    <div className="flex gap-4 text-sm font-medium text-gray-600">
                                        <span className="cursor-pointer text-green-600" onClick={() => setTimeFilter("12")}>12 Hours</span>
                                        <span className="cursor-pointer" onClick={() => setTimeFilter("24")}>Day</span>
                                        <span className="cursor-pointer" onClick={() => setTimeFilter("84")}>Week</span>
                                    </div>
                                </div> */}
                                <div className="card-body grid grid-cols-3 gap-4 mt-4">
                                    <div className="flex flex-col items-center border p-4 rounded-lg shadow-sm">
                                        <span className="text-sm text-gray-500">User Sign-in</span>
                                        <span className="text-3xl font-bold text-blue-600">{usageData.userSignIns}</span>
                                    </div>
                                    <div className="flex flex-col items-center border p-4 rounded-lg shadow-sm">
                                        <span className="text-sm text-gray-500">Admin Sign-in</span>
                                        <span className="text-3xl font-bold text-green-600">{usageData.adminSignIns}</span>
                                    </div>
                                    <div className="flex flex-col items-center border p-4 rounded-lg shadow-sm">
                                        <span className="text-sm text-gray-500">Failed Attempts</span>
                                        <span className="text-3xl font-bold text-red-600">{usageData.failedAttempts}</span>
                                    </div>
                                </div>
                                {/* <BarChart />*/}
                                <BarChart timeFilter={timeFilter} selectedCompanyId={selectedCompanyId} />
                            </div>

                            <div className="card min-w-full mt-10">
                                {/* <div className="card-header flex justify-between items-center">
                                    <h3 className="card-title text-lg font-semibold">Login Sessions</h3>
                                    <div className="flex gap-2 items-center">
                                        <select className="form-select bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="Plastic Surgery">Plastic Surgery</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Cardiology">Cardiology</option>
                                        </select>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                                            View All
                                        </button>
                                    </div>
                                </div> */}
                                {/* <LoginSession /> */}
                                <LoginSession timeFilter={timeFilter} selectedCompanyId={selectedCompanyId} />
                            </div>
                        </div>
                    </div>
                </Fragment>
            </Container>
        </div>
    );
};

export default Usagetracking;
