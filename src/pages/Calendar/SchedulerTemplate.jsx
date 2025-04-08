import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  DataGrid,
  DataGridColumnVisibility,
  KeenIcon,
  useDataGrid,
} from "@/components";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const intervalOptions = [
  15, 30, 45, 60, 75, 90, 105, 120, 135, 150,
  165, 180, 195, 210, 225, 240, 255, 270, 285, 300,
];

export default function SchedulerTemplate() {
  const [templates, setTemplates] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState("");

  const loadTemplates = async () => {
    const { data } = await axios.get(`${API_URL}/Calendar/GetAllSchedulerTemplate?companyId=${companyId}`);
    setTemplates(data);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const validate = () => {
    if (!description) {
      toast.error("Description is required.");
      return false;
    }
    if (!startTime) {
      toast.error("Start time is required.");
      return false;
    }
    if (!endTime) {
      toast.error("End time is required.");
      return false;
    }
    if (!interval) {
      toast.error("Interval is required.");
      return false;
    }
    if (startTime >= endTime) {
      toast.error("Start time must be before End time.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {
        SchedulerTemplateId: editTemplate ? editTemplate.schedulerTemplateId : 0,
        Description: description,
        StartTime: startTime,
        EndTime: endTime,
        Interval: interval,
        CreatedBy: userId,
        CompanyId: companyId,
      };
      const response = await axios.post(`${API_URL}/Calendar/AddSchedulerTemplate`, payload);
      
        toast.success("Template saved successfully!");
        loadTemplates();
        setDrawerOpen(false);
     
    } catch (error) {
      toast.error("Error saving template.");
    }
  };

  const handleEdit = (template) => {
    setEditTemplate(template);
    setDescription(template.description);
    setStartTime(template.startTime);
    setEndTime(template.endTime);
    setInterval(template.interval);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await axios.delete(`${API_URL}/Calendar/DeleteSchedulerTemplate/${id}?modifiedBy=${userId}`);
      toast.success("Deleted successfully!");
      loadTemplates();
    }
  };

  const Toolbar = ({ searchColumn }) => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-5 border-b-0">
        <h3 className="card-title">Scheduler Templates</h3>
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
    { accessorKey: "description", header: "Description" },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "endTime", header: "End Time" },
    { accessorKey: "interval", header: "Interval" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="text-blue-600" onClick={() => handleEdit(row.original)}>Edit</button>
          <button className="text-red-600" onClick={() => handleDelete(row.original.schedulerTemplateId)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Scheduler Templates</h2>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setEditTemplate(null);
          setDescription("");
          setStartTime("");
          setEndTime("");
          setInterval("");
          setDrawerOpen(true);
        }}
      >
        Add Template
      </button>

      <DataGrid
        columns={columns}
        data={templates}
        pagination={{ size: 10 }}
        toolbar={<Toolbar searchColumn="description" />}
        layout={{ card: true }}
      />

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editTemplate ? "Edit" : "Add"} Scheduler Template
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time (24hr):</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time (24hr):</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Interval (minutes):</label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select Interval</option>
                  {intervalOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt} Min</option>
                  ))}
                </select>
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
