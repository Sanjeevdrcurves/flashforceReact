import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Select from "react-select"; // Multi-select dropdown
import { DataGrid, DataGridColumnVisibility, KeenIcon, useDataGrid } from "@/components";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function Group() {
  const [Groups, setGroups] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [eventTypes, setEventTypes] = useState([]); // Available event types
  const [selectedEventTypes, setSelectedEventTypes] = useState([]); // Selected event types
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  const [GroupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const loadGroups = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/Calendar/GetEventTypeById`, {
        params: { EventTypeId: 0, CompanyId: companyId, Type: "group" },
      });
      setGroups(data);
    } catch (error) {
      toast.error("Failed to load Group.");
    }
  };

  const loadEventTypes = async () => {
    try {
      const { data } = await axios.get(
                 `${API_URL}/Calendar/GetEventTypeById`, 
                 { params: { EventTypeId: 0, CompanyId: companyId, Type:'Single' } } // Passing query parameters correctly
             );
             debugger
      setEventTypes(data.map((et) => ({ value: et.eventTypeId, label: et.eventName }))); // Formatting for Select
    } catch (error) {
      toast.error("Failed to load event types.");
    }
  };

  useEffect(() => {
    loadGroups();
    loadEventTypes();
  }, []);

  const validate = () => {
    if (!GroupName.trim()) {
      toast.error("Group Name is required.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return false;
    }
    if (selectedEventTypes.length === 0) {
      toast.error("At least one event type must be selected.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
debugger
    const payload = {
      EventTypeId: editGroup ? editGroup.eventTypeId : 0,
      EventName: GroupName.trim(),
      Description: description.trim(),
      CreatedBy: userId,
      CompanyId: companyId,
      Type:'Group',
      GroupEvent: selectedEventTypes.map((et) => et.value).join(","),
     // GroupEvent: selectedEventTypes.map((et) => et.value), // Extracting selected IDs
    };

    try {
     const response = await axios.post(
             `${API_URL}/Calendar/AddEventType`,
             payload
           );
           debugger
      if (response.data.success) {
        toast.success("Group saved successfully!");
        loadGroups();
        setDrawerOpen(false);
      } else { debugger
        toast.error(response.data.message || "Failed to save group.");
      }
    } catch (error) {debugger
      toast.error(error.response?.data?.message || "Error saving group.");
    }
  };

  const handleEdit = async (group) => {
    debugger
    setEditGroup(group);
    setGroupName(group.eventName);
    setDescription(group.description || "");

    // Convert comma-separated EventTypeIds into an array
    const selectedIds = group.groupEvent ? group.groupEvent.split(",").map(id => parseInt(id.trim())) : [];

    // Map EventTypeIds to their corresponding objects from eventTypes list
    const selectedOptions = eventTypes.filter(et => selectedIds.includes(et.value));

    setSelectedEventTypes(selectedOptions); // Set preselected values in dropdown
    setDrawerOpen(true);
};


  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this group?")) {
      try {
        await axios.delete(`${API_URL}/Calendar/DeleteEventType/${id}?modifiedBy=${userId}`);
        toast.success("Deleted successfully!");
        loadGroups();
      } catch (error) {
        toast.error("Error deleting group.");
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
    { accessorKey: "eventName", header: "Group Name" },
    { accessorKey: "description", header: "Description" },
    // {
    //   accessorKey: "eventTypes",
    //   header: "Event Types",
    //   cell: ({ row }) => row.original.eventTypes.map((et) => et.name).join(", "),
    // },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="text-blue-600" onClick={() => handleEdit(row.original)}>
            Edit
          </button>
          <button className="text-red-600" onClick={() => handleDelete(row.original.eventTypeId)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setEditGroup(null);
          setGroupName("");
          setDescription("");
          setSelectedEventTypes([]);
          setDrawerOpen(true);
        }}
      >
        Add Group
      </button>

      <DataGrid columns={columns} data={Groups} pagination={{ size: 10 }} toolbar={<Toolbar searchColumn="GroupName" />} layout={{ card: true }} />

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editGroup ? "Edit" : "Add"} Group</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Group Name:</label>
                <input type="text" value={GroupName} onChange={(e) => setGroupName(e.target.value)} className="border rounded p-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded p-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Types:</label>
                <Select
                  isMulti
                  options={eventTypes}
                  value={selectedEventTypes}
                  onChange={setSelectedEventTypes}
                  className="border rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
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
