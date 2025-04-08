import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { DataGrid, DataGridColumnVisibility, KeenIcon, useDataGrid } from "@/components";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function EventType() {
  const [eventTypes, setEventTypes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editEventType, setEditEventType] = useState(null);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  const [eventTypeName, setEventTypeName] = useState("");
  const [description, setDescription] = useState("");

  const loadEventTypes = async () => {debugger
    try {
        const { data } = await axios.get(
            `${API_URL}/Calendar/GetEventTypeById`, 
            { params: { EventTypeId: 0, CompanyId: companyId, Type:'Single' } } // Passing query parameters correctly
        );
        setEventTypes(data);
    } catch (error) {
      debugger
        toast.error("Failed to load event types.");
    }
};

  useEffect(() => {
    loadEventTypes();
  }, []);

  const validate = () => {
    if (!eventTypeName.trim()) {
      toast.error("Event Type Name is required.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
  
    const payload = {
      EventTypeId: editEventType ? editEventType.eventTypeId : 0,
      EventName: eventTypeName.trim(),
      Description: description.trim(),
      CreatedBy: userId,
      CompanyId: companyId,
       Type:'Single',
       GroupEvent:''
    };
  
    console.log("Payload:", payload);
  
    try {
      const response = await axios.post(
        `${API_URL}/Calendar/AddEventType`,
        payload
      );
  
      if (response.data.success) {
        toast.success("Event type saved successfully!");
        loadEventTypes();
        setDrawerOpen(false);
      } else {
        toast.error(response.data.message || "Failed to save event type.");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Error saving event type."
      );
    }
  };
  
  const handleEdit = (eventType) => {
    setEditEventType(eventType);
    setEventTypeName(eventType.eventName);
    setDescription(eventType.description || "");
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this event type?")) {
      try {
        await axios.delete(`${API_URL}/Calendar/DeleteEventType/${id}?modifiedBy=${userId}`);
        toast.success("Deleted successfully!");
        loadEventTypes();
      } catch (error) {
        toast.error("Error deleting event type.");
      }
    }
  };

  const Toolbar = ({ searchColumn }) => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-5 border-b-0">
       
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

  const columns = [
    { accessorKey: "eventName", header: "Event Name" },
    { accessorKey: "description", header: "Description" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="text-blue-600" onClick={() => handleEdit(row.original)}>Edit</button>
          <button className="text-red-600" onClick={() => handleDelete(row.original.eventTypeId)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setEditEventType(null);
          setEventTypeName("");
          setDescription("");
          setDrawerOpen(true);
        }}
      >
        Add Event Type
      </button>

      <DataGrid
        columns={columns}
        data={eventTypes}
        pagination={{ size: 10 }}
        toolbar={<Toolbar searchColumn="eventTypeName" />}
        layout={{ card: true }}
      />

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editEventType ? "Edit" : "Add"} Event Type
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type Name:</label>
                <input
                  type="text"
                  value={eventTypeName}
                  onChange={(e) => setEventTypeName(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
