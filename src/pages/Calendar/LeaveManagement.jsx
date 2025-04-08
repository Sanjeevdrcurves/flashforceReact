import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from 'sonner';
import {
  DataGrid,
  DataGridColumnVisibility,
  KeenIcon,
  useDataGrid,
} from "@/components";
// Example list of all countries
const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
    "Azerbaijan", "The Bahamas", "Bahrain", "Bangladesh", "Barbados", 
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", 
    "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", 
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", 
    "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", 
    "France", "Gabon", "The Gambia", "Georgia", "Germany", 
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", 
    "Iceland", "India", "Indonesia", "Iran", "Iraq", 
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", 
    "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", 
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
    "Mauritania", "Mauritius", "Mexico", "Micronesia, Federated States of", "Moldova", 
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", 
    "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", 
    "Sudan, South", "Suriname", "Sweden", "Switzerland", "Syria", 
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", 
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];


import SchedulerTemplate from "./SchedulerTemplate";
import SchedulerTemplateAttributes from "./SchedulerTemplateAttributes";
import WeeklySchedule from "./WeeklySchedule";
import EventTypeTabs from "./EventTypeTabs";
import SchedulerTemplateTabs from "./SchedulerTemplateTabs";
import CalendarManagement from "./CalendarManagement";
import BreakTimeManagement from "./BreakTime";
// API_URL defined via Vite environment variables
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function LeaveManagement() {
  // Get company and current user info from Redux
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const [selectedCountry, setSelectedCountry] = useState(''); // New state for selected country

  // -----------------------
  // Providers (Users) - loaded dynamically
  // -----------------------
  const [availableUsers, setAvailableUsers] = useState([]);
 
  
  
  useEffect(() => {
    loadAllUsers();
  }, [companyId]);

  function loadAllUsers() {
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((response) => {
        // Adjust if your API returns an object containing the array (e.g., response.data)
        const users = Array.isArray(response) ? response : response.data;
        const userOptions = users.map((u) => ({
          id: String(u.userID),
          name: `${u.firstName} ${u.lastName}`,
        }));
        setAvailableUsers(userOptions);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }
  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // Handle invalid dates
    
    // Format date using local time (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  const Toolbar = ({ searchColumn }) => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-5 border-b-0">
        <h3 className="card-title">Holidays</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <KeenIcon icon="magnifier" className="text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3" />
            <input
              type="text"
              placeholder="Search"
              className="input input-sm ps-8"
              value={table.getColumn(searchColumn)?.getFilterValue() ?? ""}
              onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
            />
          </div>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };
  const providerColumns = [
    { accessorKey: "provider", header: "Provider" },
    { accessorKey: "holidayName", header: "Title" },
    { accessorKey: "startDate", header: "Date From" },
    { accessorKey: "endDate", header: "Date To" },
    { accessorKey: "description", header: "Description" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600"
            onClick={() =>
              handleEditHoliday(row.original.holidayId || row.original.id, "User")
            }
          >
            Edit
          </button>
          <button
            className="text-red-600"
            onClick={() =>
              handleDeleteHoliday(row.original.holidayId || row.original.id)
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  
  const officeColumns = [
    { accessorKey: "holidayName", header: "Holiday Title" },
    { accessorKey: "startDate", header: "Date From" },
    { accessorKey: "endDate", header: "Date To" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "description", header: "Remarks" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600"
            onClick={() =>
              handleEditHoliday(row.original.holidayId || row.original.id, "Office")
            }
          >
            Edit
          </button>
          <button
            className="text-red-600"
            onClick={() =>
              handleDeleteHoliday(row.original.holidayId || row.original.id)
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  
  // -----------------------
  // Component State & Tabs
  // -----------------------
  // "provider" for Provider Holidays, "office" for Office Holidays.
  const [activeTab, setActiveTab] = useState("provider");

  // Filter for provider holidays (used on the page)
  const [filterProvider, setFilterProvider] = useState("");

  // -----------------------
  // Provider Holidays (API-based)
  // -----------------------
  const [providerHolidays, setProviderHolidays] = useState([]);
  const [currentPageProviderHoliday, setCurrentPageProviderHoliday] = useState(1);
  const pageSizeProviderHoliday = 5;

  // Drawer state for Provider Holiday
  // Note: Provider selection is read-only (from filterProvider)
  const [showProviderHolidayDrawer, setShowProviderHolidayDrawer] = useState(false);
  const [phTitle, setPhTitle] = useState("");
  const [phDateFrom, setPhDateFrom] = useState("");
  const [phDateTo, setPhDateTo] = useState("");
  const [phDescription, setPhDescription] = useState("");
  
  // New state: to store the holiday ID for editing provider holidays (0 means new)
  const [providerHolidayEditId, setProviderHolidayEditId] = useState(0);

  // -----------------------
  // Office Holidays (API-based)
  // -----------------------
  const [officeHolidays, setOfficeHolidays] = useState([]);
  const [currentPageOfficeHoliday, setCurrentPageOfficeHoliday] = useState(1);
  const pageSizeOfficeHoliday = 5;

  // Drawer state for Office Holiday
  const [showOfficeHolidayDrawer, setShowOfficeHolidayDrawer] = useState(false);
  const [ohTitle, setOhTitle] = useState("");
  const [ohDateFrom, setOhDateFrom] = useState("");
  const [ohDateTo, setOhDateTo] = useState("");
  const [ohRemarks, setOhRemarks] = useState("");
 
  // New state: to store the holiday ID for editing office holidays
  const [officeHolidayEditId, setOfficeHolidayEditId] = useState(0);

  // -----------------------
  // Load Holidays from API
  // -----------------------
  function loadProviderHolidays() {
    // Fetch provider holidays (holidayType = "User")
    fetch(`${API_URL}/Calendar/GetHolidays?holidayType=User&userId=${filterProvider}&companyId=${companyId}`)
      .then((res) => res.json())
      .then((data) => setProviderHolidays(data))
      .catch((error) =>
        console.error("Error fetching provider holidays:", error)
      );
  }

  function loadOfficeHolidays() {
    // Fetch office holidays (holidayType = "Office")
    fetch(`${API_URL}/Calendar/GetHolidays?holidayType=Office&userId=0&companyId=${companyId}`)
      .then((res) => res.json())
      .then((data) => setOfficeHolidays(data))
      .catch((error) =>
        console.error("Error fetching office holidays:", error)
      );
  }
  const providerData = providerHolidays.map((h) => ({
    ...h,
    provider: availableUsers.find((u) => u.id === String(h.userId))?.name || "N/A",
    startDate: formatDateForInput(h.startDate),
    endDate: formatDateForInput(h.endDate),
  }));
  
  const officeData = officeHolidays.map((h) => ({
    ...h,
    startDate: formatDateForInput(h.startDate),
    endDate: formatDateForInput(h.endDate),
  }));
  
  // Load holidays when active tab or companyId changes
  useEffect(() => {
    if (activeTab === "provider") {
      loadProviderHolidays();
    } else if (activeTab === "office") {
      loadOfficeHolidays();
    }
  }, [activeTab, companyId]);

  // -----------------------
  // Handle Edit Holiday (for both types)
  // -----------------------
  function handleEditHoliday(holidayId, holidayType) {
    fetch(`${API_URL}/Calendar/GetHolidayById/${holidayId}`)
      .then((res) => res.json())
      .then((data) => {debugger
        if (holidayType === "User") {
          // Update provider holiday edit fields
          setProviderHolidayEditId(data.holidayId || data.id);
          // Optionally update filterProvider if needed.
          setFilterProvider(String(data.userId));
          setPhTitle(data.holidayName);         
          setPhDateFrom(formatDateForInput(data.startDate));
          setPhDateTo(formatDateForInput(data.endDate));
          setPhDescription(data.description);
          setShowProviderHolidayDrawer(true);
        } else if (holidayType === "Office") {
          // Update office holiday edit fields
          setOfficeHolidayEditId(data.holidayId || data.id);
          setOhTitle(data.holidayName);
          setOhDateFrom(formatDateForInput(data.startDate));
          setOhDateTo(formatDateForInput(data.endDate));
          setSelectedCountry(data.country || ''); // Set country from fetched data
          setOhRemarks(data.description);
          setShowOfficeHolidayDrawer(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching holiday details:", error);
      });
  }

  // -----------------------
  // Handle Save Provider Holiday
  // -----------------------
  function handleSaveProviderHoliday() {
   
    if (!filterProvider || !phTitle || !phDateFrom || !phDateTo) {
      toast.error("Please fill in all required fields and ensure a provider is selected from the filter.");
      return;
    }
    const start = new Date(phDateFrom);
    const end = new Date(phDateTo);
    if (start > end) {
      toast.error("Start date must be before end date.");
      return;
    }
    // Construct the holiday DTO for provider holiday; if editing, providerHolidayEditId will be non‑zero.
    const holiday = {
      holidayId: providerHolidayEditId, 
      holidayName: phTitle,
      startDate: phDateFrom,
      endDate: phDateTo,
      description: phDescription,
      holidayType: "User",
      companyId: companyId,
      userId: filterProvider,
      createdBy: userId,
      country: "", // Include the selected country in the holiday object
    };

    fetch(`${API_URL}/Calendar/AddHoliday`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(holiday),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          toast.success("Provider holiday saved successfully!");
          setShowProviderHolidayDrawer(false);
          // Reset edit ID and fields
          setProviderHolidayEditId(0);
          setPhTitle("");
          setPhDateFrom("");
          setPhDateTo("");
          setPhDescription("");
          loadProviderHolidays();
        } else {
          toast.error("Failed to save provider holiday.");
        }
      })
      .catch((error) => {
        debugger
        console.error("Error saving provider holiday:", error.response?.data || error);
        toast.error("An error occurred while saving the provider holiday.");
      });
  }

  // -----------------------
  // Handle Save Office Holiday
  // -----------------------
  function handleSaveOfficeHoliday() {
   
    if (!ohTitle || !ohDateFrom || !ohDateTo) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const start = new Date(ohDateFrom);
    const end = new Date(ohDateTo);
    if (start > end) {
      toast.error("Start date must be before end date.");
      return;
    }
    const holiday = {
      holidayId: officeHolidayEditId,
      holidayName: ohTitle,
      startDate: ohDateFrom,
      endDate: ohDateTo,
      description: ohRemarks,
      holidayType: "Office",
      companyId: companyId,
      userId: 0,
      createdBy: userId,
      country:  selectedCountry, // Include the selected country in the holiday object
 
    };

    fetch(`${API_URL}/Calendar/AddHoliday`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(holiday),
    })
      .then((res) => res.json())
      .then((response) => {  debugger;
        if (response.success) {
          toast.error("Office holiday saved successfully!");
          setShowOfficeHolidayDrawer(false);
          setOfficeHolidayEditId(0);
          setOhTitle("");
          setOhDateFrom("");
          setOhDateTo("");
          setOhRemarks("");
          loadOfficeHolidays();
        } else {
          toast.error("Failed to save holiday.");
        }
      })
      .catch((error) => {
        debugger
        console.error("Error saving office holiday:", error.response?.data || error);
        toast.error("An error occurred while saving the holiday.");
      });
  }

  // -----------------------
  // Handle Delete Holiday (for both types)
  // -----------------------
  function handleDeleteHoliday(holidayId) {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    fetch(`${API_URL}/Calendar/DeleteHoliday/${holidayId}?modifiedBy=${userId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((response) => {
        toast.error("Holiday deleted successfully!");
        if (activeTab === "provider") {
          loadProviderHolidays();
        } else {
          loadOfficeHolidays();
        }
      })
      .catch((error) => {
        console.error("Error deleting holiday:", error);
        toast.error("An error occurred while deleting the holiday.");
      });
  }

  // -----------------------
  // Pagination for Provider Holidays
  // -----------------------
  const filteredProviderHolidays = providerHolidays.filter((holiday) => {
    if (filterProvider && String(holiday.userId) !== filterProvider) return false;
    return true;
  });
  const totalProviderHolidayPages = Math.ceil(
    filteredProviderHolidays.length / pageSizeProviderHoliday
  );
  const paginatedProviderHolidays = filteredProviderHolidays.slice(
    (currentPageProviderHoliday - 1) * pageSizeProviderHoliday,
    currentPageProviderHoliday * pageSizeProviderHoliday
  );

  // -----------------------
  // Pagination for Office Holidays
  // -----------------------
  const totalOfficeHolidayPages = Math.ceil(
    officeHolidays.length / pageSizeOfficeHoliday
  );
  const paginatedOfficeHolidays = officeHolidays.slice(
    (currentPageOfficeHoliday - 1) * pageSizeOfficeHoliday,
    currentPageOfficeHoliday * pageSizeOfficeHoliday
  );

  // -----------------------
  // Render Component
  // -----------------------
  return (
    <div className="p-4">
      {/* <h1 className="text-3xl font-bold mb-4">
        Manage Provider &amp; Office Holidays
      </h1> */}

      {/* Show filter only for Provider Holidays */}
      {activeTab === "provider" && (
        <div className="mb-4 flex items-center">
          <label className="mr-2 font-medium">Filter Provider:</label>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="border rounded p-1"
          >
            <option value="">All</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b mb-4">
        <button
          onClick={() => setActiveTab("provider")}
          className={`px-4 py-2 ${
            activeTab === "provider"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Provider Holidays
        </button>
        <button
          onClick={() => setActiveTab("office")}
          className={`px-4 py-2 ml-4 ${
            activeTab === "office"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Office Holidays
        </button>

        <button
          onClick={() => setActiveTab("SchedulerTemplate")}
          className={`px-4 py-2 ${
            activeTab === "SchedulerTemplate"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Scheduler Template
        </button>

        <button
          onClick={() => setActiveTab("EventType")}
          className={`px-4 py-2 ${
            activeTab === "EventType"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Events/Groups
        </button>
        <button
          onClick={() => setActiveTab("BreakTime")}
          className={`px-4 py-2 ${
            activeTab === "BreakTime"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          BreakTime
        </button>
        <button
          onClick={() => setActiveTab("Calendar")}
          className={`px-4 py-2 ${
            activeTab === "Calendar"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Calendar
        </button>
        {/* <button
          onClick={() => setActiveTab("SchedulerTemplateAttr")}
          className={`px-4 py-2 ${
            activeTab === "SchedulerTemplateAttr"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Scheduler Template Detail
        </button>
        <button
          onClick={() => setActiveTab("WeeklySchedule")}
          className={`px-4 py-2 ${
            activeTab === "WeeklySchedule"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
          }`}
        >
          Weekly Schedule
        </button> */}
      </div>

      {/* Tab Content */}
      {activeTab === "provider" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Provider Holidays</h2>
          <button
            onClick={() => {
              // Open the drawer for a new provider holiday
              setProviderHolidayEditId(0);
              setPhTitle("");
              setPhDateFrom("");
              setPhDateTo("");
              setPhDescription("");
              setShowProviderHolidayDrawer(true);
            }}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Provider Holiday
          </button>
          <DataGrid
  columns={providerColumns}
  data={providerData}
  pagination={{ size: 10 }}
  toolbar={<Toolbar searchColumn="provider" />}
  layout={{ card: true }}
/>
        </div>
      )}

      {activeTab === "office" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Office Holidays</h2>
          <button
            onClick={() => {
              setOfficeHolidayEditId(0);
              setOhTitle("");
              setOhDateFrom("");
              setOhDateTo("");
              setOhRemarks("");
              setShowOfficeHolidayDrawer(true);
            }}
            className="mb-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Add Office Holiday
          </button>
          <DataGrid
  columns={officeColumns}
  data={officeData}
  pagination={{ size: 10 }}
  toolbar={<Toolbar searchColumn="holidayName" />}
  layout={{ card: true }}
/>

        </div>
      )}
 {activeTab === "SchedulerTemplate" && (
        <SchedulerTemplateTabs />
      )}
{activeTab === "EventType" && (
        <EventTypeTabs />
      )}
 {activeTab === "Calendar" && (
        <CalendarManagement />
      )}
      {activeTab === "WeeklySchedule" && (
      <WeeklySchedule />
      )} 
      {activeTab === "BreakTime" && (
        <BreakTimeManagement />
      )}
{/* {activeTab === "SchedulerTemplateAttr" && (
        <SchedulerTemplateAttributes />
      )}
      {activeTab === "WeeklySchedule" && (
      <WeeklySchedule />
      )} */}
      {/* Provider Holiday Drawer */}
      {showProviderHolidayDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowProviderHolidayDrawer(false)}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ${
              showProviderHolidayDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              {providerHolidayEditId ? "Edit" : "Add"} Provider Holiday
            </h2>
            <form className="space-y-4">
              {/* Show the provider name read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Provider:
                </label>
                {filterProvider ? (
                  <div className="border rounded p-2 w-full">
                    {availableUsers.find((user) => user.id === filterProvider)?.name}
                  </div>
                ) : (
                  <div className="border rounded p-2 w-full text-gray-500">
                    No provider selected
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  value={phTitle}
                  onChange={(e) => setPhTitle(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date From:
                  </label>
                  <input
                    type="date"
                    value={phDateFrom}
                    onChange={(e) => setPhDateFrom(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date To:
                  </label>
                  <input
                    type="date"
                    value={phDateTo}
                    onChange={(e) => setPhDateTo(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  value={phDescription}
                  onChange={(e) => setPhDescription(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
           
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProviderHoliday}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Office Holiday Drawer */}
      {showOfficeHolidayDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowOfficeHolidayDrawer(false)}
          ></div>
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform duration-300 ${
              showOfficeHolidayDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              {officeHolidayEditId ? "Edit" : "Add"} Office Holiday
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Holiday Title:
                </label>
                <input
                  type="text"
                  value={ohTitle}
                  onChange={(e) => setOhTitle(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date From:
                  </label>
                  <input
                    type="date"
                    value={ohDateFrom}
                    onChange={(e) => setOhDateFrom(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date To:
                  </label>
                  <input
                    type="date"
                    value={ohDateTo}
                    onChange={(e) => setOhDateTo(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country:</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select a Country</option>
                  {allCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remarks:
                </label>
                <textarea
                  value={ohRemarks}
                  onChange={(e) => setOhRemarks(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveOfficeHoliday}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
