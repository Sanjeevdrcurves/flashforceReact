import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataGrid } from "@/components";
import axios from "axios";
import { toast } from "sonner"; // Assuming you are using sonner for notifications

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function TeamTypes() {
  const [teamTypes, setTeamTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ typeId: 0, typeName: "" });
  const [error, setError] = useState("");
  const { userId,companyId } = useSelector((state) => state.AuthReducerKey);
  useEffect(() => {
    loadTeamTypes();
  }, []);

  async function loadTeamTypes() {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Team/GetAllTeamTypes/${companyId}`);
      setTeamTypes(response.data);
    } catch (error) {
      debugger;
      console.error("Preset save error:", error.response?.data || error);
      toast.error("Error loading team types");
     
    }
    setLoading(false);
  }

  const handleSave = async () => {
    if (!formData.typeName.trim()) {
      toast.error("Team Type Name is required");
      return;
    }
    setError("");
  
    try {
      const payload = {
        typeId: formData.typeId || 0, // Ensure typeId is sent as null when creating a new type
        typeName: formData.typeName.trim(),
        companyId,  
        createdBy: userId,
      };
  
  
      await axios.post(`${API_URL}/Team/AddTeamTypes`, payload);
      setDrawerOpen(false);
      loadTeamTypes();
      toast.success(`Team Type ${formData.typeId ? "updated" : "added"} successfully`);
    } catch (error) {
      toast.error("Error saving team type");
      console.error("Error saving team type:", error);
    }
  };
  
  const handleEdit = (row) => {
    setFormData(row);
    setDrawerOpen(true);
    setError("");
  };

  const handleDelete = async (typeId) => {
    if (!window.confirm("Are you sure you want to delete this team type?")) return;

    try {
      await axios.delete(`${API_URL}/Team/DeleteTeamTypes/${typeId}/${userId}`);
      loadTeamTypes();
      toast.success("Team Type deleted successfully");
    } catch (error) {
      toast.error("Error deleting team type");
      console.error("Error deleting team type:", error);
    }
  };

  const columns = [
    {
        accessorKey: "serial",
        header: "#",
        cell: ({ row }) => row.index + 1, // Serial number based on row index
      },
    { accessorKey: "typeName", header: "Type Name" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button variant="destructive" onClick={() => handleDelete(row.original.typeId)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 shadow-md border rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Team Types</h2>
        <Button
          onClick={() => {
            setFormData({ typeId: 0, typeName: "" });
            setDrawerOpen(true);
            setError("");
          }}
        >
          Add Type
        </Button>
      </div>

      <DataGrid columns={columns} data={teamTypes} pagination={{ size: 10 }} loading={loading} />

      {drawerOpen && (
        <div className="fixed top-0 right-0 w-[400px] md:w-[500px] h-full bg-white shadow-xl border-l border-gray-200 z-50">
          {/* Drawer Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">
              {formData.typeId ? "Edit Team Type" : "Create Team Type"}
            </h2>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>X</Button>
          </div>

          {/* Drawer Content */}
          <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-56px)] pb-32">
            {/* Type Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Team Type Name
              </label>
              <Input
                value={formData.typeName}
                onChange={(e) =>
                  setFormData({ ...formData, typeName: e.target.value })
                }
                placeholder="Enter Team Type Name"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button className="bg-blue-600 text-white" onClick={handleSave}>
                {formData.typeId ? "Update" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
