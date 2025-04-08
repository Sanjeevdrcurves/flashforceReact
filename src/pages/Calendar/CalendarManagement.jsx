import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { DataGrid, DataGridColumnVisibility, KeenIcon, useDataGrid } from "@/components";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export const tzStrings = [
  { label: "(GMT-12:00) International Date Line West", value: "Etc/GMT+12" },
  { label: "(GMT-11:00) Midway Island, Samoa", value: "Pacific/Midway" },
  { label: "(GMT-10:00) Hawaii", value: "Pacific/Honolulu" },
  { label: "(GMT-09:00) Alaska", value: "US/Alaska" },
  { label: "(GMT-08:00) Pacific Time (US & Canada)", value: "America/Los_Angeles" },
  { label: "(GMT-07:00) Arizona", value: "US/Arizona" },
  { label: "(GMT-06:00) Central Time (US & Canada)", value: "US/Central" },
  { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "US/Eastern" },
  { label: "(GMT+00:00) Greenwich Mean Time", value: "Etc/Greenwich" },
  { label: "(GMT+01:00) Amsterdam, Berlin, Rome", value: "Europe/Amsterdam" },
  { label: "(GMT+02:00) Cairo", value: "Africa/Cairo" },
  { label: "(GMT+03:00) Moscow, St. Petersburg", value: "Europe/Moscow" },
  { label: "(GMT+05:30) Chennai, Kolkata, Mumbai", value: "Asia/Calcutta" },
  { label: "(GMT+08:00) Beijing, Hong Kong", value: "Asia/Hong_Kong" },
  { label: "(GMT+09:00) Tokyo", value: "Asia/Tokyo" },
  { label: "(GMT+10:00) Sydney", value: "Australia/Sydney" },
];

export default function CalendarManagement() {
  const [calendars, setCalendars] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCalendar, setEditCalendar] = useState(null);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  const [calendarName, setCalendarName] = useState("");
  const [description, setDescription] = useState("");
  const [timeZone, setTimeZone] = useState("");

  const loadCalendars = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/Calendar/GetCalendar?companyId=${companyId}`);
      setCalendars(data);
    } catch (error) {
      toast.error("Failed to load calendars.");
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  const validate = () => {
    if (!calendarName.trim()) {
      toast.error("Calendar name is required.");
      return false;
    }
    if (!timeZone) {
      toast.error("Time Zone is required.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {
        CalendarId: editCalendar ? editCalendar.calendarId : 0,
        CalendarName: calendarName,
        Description: description,
        TimeZone: timeZone,
        CreatedBy: userId,
        CompanyId: companyId,
      };
      const response = await axios.post(`${API_URL}/Calendar/AddCalendar`, payload);
      debugger;
      if (response.data.id === "Calendar name already exists.") {
        toast.error("Calendar name already exists.");
      } else {
        toast.success(editCalendar ? "Calendar updated successfully!" : "Calendar saved successfully!");
        loadCalendars();
        setDrawerOpen(false);
      }
    } catch (error) {
        debugger;
      toast.error("Error saving calendar.");
    }
  };

  const handleEdit = (calendar) => {
    setEditCalendar(calendar);
    setCalendarName(calendar.calendarName);
    setDescription(calendar.description);
    setTimeZone(calendar.timeZone);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this calendar?")) {
      await axios.delete(`${API_URL}/Calendar/DeleteCalendar/${id}?modifiedBy=${userId}`);
      toast.success("Calendar deleted successfully!");
      loadCalendars();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Calendar Management</h2>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setEditCalendar(null);
          setCalendarName("");
          setDescription("");
          setTimeZone("");
          setDrawerOpen(true);
        }}
      >
        Add Calendar
      </button>

      <DataGrid
        columns={[
          { accessorKey: "calendarName", header: "Calendar Name" },
          { accessorKey: "description", header: "Description" },
          { accessorKey: "timeZone", header: "Time Zone" },
          {
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <button className="text-blue-600" onClick={() => handleEdit(row.original)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(row.original.calendarId)}>Delete</button>
              </div>
            ),
          },
        ]}
        data={calendars}
        pagination={{ size: 10 }}
        layout={{ card: true }}
      />

      {drawerOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform transform translate-x-0">
          <h2 className="text-2xl font-bold mb-4">{editCalendar ? "Edit" : "Add"} Calendar</h2>
          <form className="space-y-4">
            <label>Calendar Name:</label>
            <input type="text" value={calendarName} onChange={(e) => setCalendarName(e.target.value)} className="border rounded p-2 w-full" />
            <label>Description:</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded p-2 w-full" />
            <label>Time Zone:</label>
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="border rounded p-2 w-full">
              <option value="">Select Time Zone</option>
              {tzStrings.map((tz) => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDrawerOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
             </form>
        </div>
      )}
    </div>
  );
}
