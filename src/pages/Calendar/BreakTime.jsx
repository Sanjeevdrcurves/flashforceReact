import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { DataGrid } from "@/components";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function BreakTimeManagement() {
  const [breakTimes, setBreakTimes] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editBreakTime, setEditBreakTime] = useState(null);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  // Form fields for break time details
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  // New state for selected provider (user)
  const [selectedProvider, setSelectedProvider] = useState("");

  const loadBreakTimes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/Calendar/GetBreakTimes?companyId=${companyId}`);
      setBreakTimes(data);
    } catch (error) {
      toast.error("Failed to load break times.");
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

  useEffect(() => {
    loadBreakTimes();
    loadAllUsers();
  }, [companyId]);

  const validate = () => {
    if (!selectedProvider) {
        toast.error("Provider is required.");
        return false;
      }

    if (!startDate) {
      toast.error("Start date is required.");
      return false;
    }
    if (!startTime) {
      toast.error("Start time is required.");
      return false;
    }
    if (!endDate) {
      toast.error("End date is required.");
      return false;
    }
    if (!endTime) {
      toast.error("End time is required.");
      return false;
    }
     if (!description) {
        toast.error("description is required.");
        return false;
      }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {
        BreakTimeId: editBreakTime ? editBreakTime.breakTimeId : 0,
        StartDate: startDate,
        StartTime: startTime,
        EndDate: endDate,
        EndTime: endTime,
        Description: description,
        // Include the selected provider's id as UserId
        UserId: selectedProvider,
        CreatedBy: userId,
        CompanyId: companyId,
      };
      const response = await axios.post(`${API_URL}/Calendar/AddBreakTime`, payload);
    debugger
      if (response.data.id === "Break time already exists.") {
        toast.error("Break time already exists.");
      } else {
        toast.success(editBreakTime ? "Break time updated successfully!" : "Break time saved successfully!");
        loadBreakTimes();
        setDrawerOpen(false);
      }
    } catch (error) {
        debugger
      toast.error("Error saving break time.");
    }
  };

  const handleEdit = (breakTime) => {
    setEditBreakTime(breakTime);
    setStartDate(breakTime.startDate);
    setStartTime(breakTime.startTime);
    setEndDate(breakTime.endDate);
    setEndTime(breakTime.endTime);
    setDescription(breakTime.description);
    setSelectedProvider(breakTime.userId ? String(breakTime.userId) : "");
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this break time?")) {
      try {
        await axios.delete(`${API_URL}/Calendar/DeleteBreakTime/${id}?modifiedBy=${userId}`);
        toast.success("Break time deleted successfully!");
        loadBreakTimes();
      } catch (error) {
        toast.error("Error deleting break time.");
      }
    }
  };

  return (
   
      <div>
        <h2 className="text-3xl font-bold mb-4">Break Time Management</h2>
        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditBreakTime(null);
            setStartDate("");
            setStartTime("");
            setEndDate("");
            setEndTime("");
            setDescription("");
            setSelectedProvider("");
            setDrawerOpen(true);
          }}
        >
          Add Break Time
        </button>

        <DataGrid
          columns={[
            { accessorKey: "userName", header: "Provider Name" },
            { accessorKey: "startDate", header: "Start Date" },
            { accessorKey: "startTime", header: "Start Time" },
            { accessorKey: "endDate", header: "End Date" },
            { accessorKey: "endTime", header: "End Time" },
            { accessorKey: "description", header: "Description" },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <button className="text-blue-600" onClick={() => handleEdit(row.original)}>
                    Edit
                  </button>
                  <button className="text-red-600" onClick={() => handleDelete(row.original.breakTimeId)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={breakTimes}
          pagination={{ size: 10 }}
          layout={{ card: true }}
        />

        {drawerOpen && (
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto transition-transform transform translate-x-0">
            <h2 className="text-2xl font-bold mb-4">{editBreakTime ? "Edit" : "Add"} Break Time</h2>
            <form className="space-y-4">
            <label>Provider:</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Provider</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2 w-full"
              />
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded p-2 w-full"
              />
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2 w-full"
              />
              <label>End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border rounded p-2 w-full"
              />
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded p-2 w-full"
              />
            
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    
  );
}
