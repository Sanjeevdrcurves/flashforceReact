import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Select, { components } from 'react-select';
import { useSelector } from "react-redux";
import { FaSave, FaTrashAlt, FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function WeeklySchedule() {
  // Get company and current user info from Redux
  const { companyId, userId } = useSelector((state) => state.AuthReducerKey);

  // State for available providers, scheduler templates, and weekly schedule rows
  const [availableUsers, setAvailableUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [rows, setRows] = useState([]);

  // Selected provider from dropdown
  const [selectedUserId, setSelectedUserId] = useState("");

  // Helper: Format a date string (from API) to "YYYY-MM-DD" for input fields.
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };

  // -----------------------
  // Load Providers from API
  // -----------------------

    // Load available calendars
    const loadCalendars = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/Calendar/GetCalendar?companyId=${companyId}`);
        setCalendars(data.map((cal) => ({ value: cal.calendarId, label: cal.calendarName })));
      } catch (error) {
        toast.error("Failed to load calendars.");
      }
    };

  const loadAllUsers = () => {
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((response) => {
        const users = Array.isArray(response) ? response : response.data;
        const userOptions = users.map((u) => ({
          id: String(u.userID),
          name: `${u.firstName} ${u.lastName}`,
        }));
        setAvailableUsers(userOptions);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load providers.");
      });
  };

  // -----------------------
  // Load Scheduler Templates from API
  // -----------------------
  const loadTemplates = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/Calendar/GetAllSchedulerTemplate?companyId=${companyId}`
      );
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load scheduler templates.");
    }
  };

  // -----------------------
  // Load Weekly Schedule for the Selected Provider
  // -----------------------
  const loadUserTimings = async () => {
    if (!selectedUserId) {
      setRows([]);
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/Calendar/GetUserTiming`, {
        params: {
          userTimingId: 0, // 0 to fetch all timings for the provider
          companyId,
          userId: selectedUserId,
        },
      });   debugger
      // Map API data into our row structure.
      const mappedRows = data.map((item) => ({
        id: item.userTimingId, // local id used for React rendering
        UserTimingId: item.userTimingId, // DB record id
        day: item.day, // expect number 0-6
        dateFrom: formatDateForInput(item.dateFrom),
        dateTo: formatDateForInput(item.dateTo),
        timeFrom: item.timeFrom, // e.g. "08:00"
        timeTo: item.timeTo,
        breakFrom: item.breakTimeFrom, // mapped from API field breakTimeFrom
        breakTo: item.breakTimeTo,     // mapped from API field breakTimeTo
        schedulerTemplateId: item.schedulerTemplateId,
        selectedCalendars: item.calendarIds ? item.calendarIds.split(',').map(id => 
          calendars.find(cal => cal.value === parseInt(id))
        ).filter(Boolean) : [], // Ensure non-null and valid mappings
      }));
      setRows(mappedRows);
    } catch (error) {
      console.error("Error loading user timings", error);
      toast.error("Failed to load weekly schedule.");
    }
  };

  // -----------------------
  // useEffect: Load providers and templates when companyId changes
  // -----------------------
  useEffect(() => {
    if (companyId) {
      loadAllUsers();
      loadTemplates();
      loadCalendars();
    }
  }, [companyId]);

  // -----------------------
  // useEffect: Load weekly schedule when a provider is selected
  // -----------------------
  useEffect(() => {
    loadUserTimings();
  }, [selectedUserId, companyId]);

  // -----------------------
  // Add a new row to the schedule table
  // -----------------------
  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary local id
        UserTimingId: 0, // 0 indicates a new row (to be inserted)
        day: "",
        dateFrom: "",
        dateTo: "",
        timeFrom: "",
        timeTo: "",
        breakFrom: "",
        breakTo: "",
        schedulerTemplateId: "",
        selectedCalendars: [],
      },
    ]);
  };

  // -----------------------
  // Update a specific field in a row
  // -----------------------
  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // -----------------------
  // Save (or update) a row using the API endpoint (sp_SaveOrUpdateUserTiming)
  // -----------------------
  const handleSaveRow = async (row) => {
    if (!selectedUserId) {
      toast.error("Please select a provider.");
      return;
    }
    const payload = {
      UserTimingId: row.UserTimingId, // if 0 then insert, otherwise update
      UserId: selectedUserId,
      CompanyId: companyId,
      Day: row.day ? parseInt(row.day, 10) : 0,
      TimeFrom: row.timeFrom,
      TimeTo: row.timeTo,
      OFF: 0,
      DateFrom: row.dateFrom,
      DateTo: row.dateTo,
      ScheduleType: 0,
      DoubleCheck: false,
      BreakTimeFrom: row.breakFrom,
      BreakTimeTo: row.breakTo,
      SchedulerTemplateId: row.schedulerTemplateId,
      CreatedBy: userId,
      Calendars: row.selectedCalendars.map((cal) => cal.value), // Extract selected calendar IDs
  
    };
    debugger
    try {
      await axios.post(`${API_URL}/Calendar/SaveOrUpdateUserTiming`, payload);
      toast.success(
        row.UserTimingId && row.UserTimingId > 0
          ? "Row updated successfully!"
          : "Row saved successfully!"
      );
      // Refresh the grid by reloading the timings
      loadUserTimings();
    } catch (error) {
      console.error("Error saving row", error);
      toast.error("Failed to save row.");
    }
  };

  // -----------------------
  // Cancel (remove) a row
  // -----------------------
  const handleCancelRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };
  const handleDeleteRow = async (row) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;
    try {
      await axios.delete(`${API_URL}/Calendar/DeleteUserTiming/${row.UserTimingId}`, {
        params: { modifiedBy: row.CreatedBy || userId, companyId },
      });
      toast.success("Row deleted successfully!");
      // Refresh the provider timings after deletion
      loadUserTimings();
    } catch (error) {
      console.error("Error deleting row", error.response?.data || error);
      toast.error("Failed to delete row.");
    }
  };

  const CustomValueContainer = ({ children, getValue, ...props }) => {
    // Retrieve all selected options
    const selectedOptions = getValue();
    const count = selectedOptions.length;
  
    // Conditionally render the number of selected items or the default children
    if (!props.selectProps.menuIsOpen && count > 0) {
      return (
        <components.ValueContainer {...props}>
          {`${count} selected`}
        </components.ValueContainer>
      );
    }
  
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  };


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Weekly Schedule</h1>

      {/* Provider Selection Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Provider:</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">-- Select Provider --</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Day</th>
            <th className="border p-2">Date From</th>
            <th className="border p-2">Date To</th>
            <th className="border p-2">Time From</th>
            <th className="border p-2">Time To</th>
            <th className="border p-2">Break From</th>
            <th className="border p-2">Break To</th>
            <th className="border p-2">Calendars</th>
            <th className="border p-2">Scheduler Template</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">
                <select
                  value={row.day}
                  onChange={(e) => handleRowChange(row.id, "day", e.target.value)}
                  className="border p-1 rounded w-full"
                >
                  <option value="">Select Day</option>
                  {/* <option value="0">Sunday</option> */}
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="date"
                  value={row.dateFrom}
                  onChange={(e) =>
                    handleRowChange(row.id, "dateFrom", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="date"
                  value={row.dateTo}
                  onChange={(e) =>
                    handleRowChange(row.id, "dateTo", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="time"
                  value={row.timeFrom}
                  onChange={(e) =>
                    handleRowChange(row.id, "timeFrom", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="time"
                  value={row.timeTo}
                  onChange={(e) =>
                    handleRowChange(row.id, "timeTo", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="time"
                  value={row.breakFrom}
                  onChange={(e) =>
                    handleRowChange(row.id, "breakFrom", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="time"
                  value={row.breakTo}
                  onChange={(e) =>
                    handleRowChange(row.id, "breakTo", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="border p-2">
              <Select
                  isMulti
                  options={calendars}
                  value={row.selectedCalendars}
                  onChange={(selected) => handleRowChange(row.id, "selectedCalendars", selected)}
                  components={{ ValueContainer: CustomValueContainer }}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <select
                  value={row.schedulerTemplateId}
                  onChange={(e) =>
                    handleRowChange(row.id, "schedulerTemplateId", e.target.value)
                  }
                  className="border p-1 rounded w-full"
                >
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option
                      key={template.schedulerTemplateId}
                      value={template.schedulerTemplateId}
                    >
                      {template.description}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleSaveRow(row)}
                  >
                    {/* {row.UserTimingId && row.UserTimingId > 0 ?  <FaSave size={20} /> : <FaSave size={20} /> } */}
                    <FaSave size={16} />
                  </button>
                  {row.UserTimingId && row.UserTimingId > 0 ? (
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteRow(row)}
                    >
                       <FaTrashAlt size={16} />
                    </button>
                  ) : (
                    <button
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                      onClick={() => handleCancelRow(row.id)}
                    >
                       <FaTrashAlt size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAddRow}
      >
        Add More
      </button>
    </div>
  );
}
