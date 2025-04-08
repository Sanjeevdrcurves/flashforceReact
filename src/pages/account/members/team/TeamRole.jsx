import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataGrid } from "@/components";
import axios from "axios";
import { toast } from "sonner"; // Notifications

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function TeamRoles() {
  const [teamRoles, setTeamRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ teamRoleId: 0, roleName: "" });
  const [error, setError] = useState("");
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  useEffect(() => {
    loadTeamRoles();
  }, []);

  async function loadTeamRoles() {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Team/GetAllTeamRole/${companyId}`);
      debugger
      setTeamRoles(response.data);
    } catch (error) {
      toast.error("Error loading team roles");
      console.error("Error loading team roles:", error);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    if (!formData.roleName.trim()) {
      toast.error("Role Name is required");
      return;
    }
    setError("");

    try {
      const payload = {
        ...formData,
        companyId,  // Add companyId
        createdBy: userId,  // Add createdBy as userId
      };

      await axios.post(`${API_URL}/Team/AddTeamRole`, payload);
      setDrawerOpen(false);
      loadTeamRoles();
      toast.success(`Team Role ${formData.teamRoleId ? "updated" : "added"} successfully`);
    } catch (error) {
      toast.error("Error saving team role");
      console.error("Error saving team role:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData(row);
    setDrawerOpen(true);
    setError("");
  };

  const handleDelete = async (teamRoleId) => {
    debugger
    if (!window.confirm("Are you sure you want to delete this team role?")) return;

    try {
      await axios.delete(`${API_URL}/Team/DeleteTeamRole/${teamRoleId}/${userId}`);
      loadTeamRoles();
      toast.success("Team Role deleted successfully");
    } catch (error) {
      toast.error("Error deleting team role");
      console.error("Error deleting team role:", error);
    }
  };

  const columns = [
    {
      accessorKey: "serial",
      header: "#",
      cell: ({ row }) => row.index + 1, // Serial number based on row index
    },
    { accessorKey: "roleName", header: "Role Name" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button variant="destructive" onClick={() => handleDelete(row.original.teamRoleId)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 shadow-md border rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Team Roles</h2>
        <Button
          onClick={() => {
            setFormData({ teamRoleId: 0, roleName: "" });
            setDrawerOpen(true);
            setError("");
          }}
        >
          Add Role
        </Button>
      </div>

      <DataGrid columns={columns} data={teamRoles} pagination={{ size: 10 }} loading={loading} />

      {drawerOpen && (
        <div className="fixed top-0 right-0 w-[400px] md:w-[500px] h-full bg-white shadow-xl border-l border-gray-200 z-50">
          {/* Drawer Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">
              {formData.teamRoleId ? "Edit Team Role" : "Create Team Role"}
            </h2>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>X</Button>
          </div>

          {/* Drawer Content */}
          <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-56px)] pb-32">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role Name
              </label>
              <Input
                value={formData.roleName}
                onChange={(e) =>
                  setFormData({ ...formData, roleName: e.target.value })
                }
                placeholder="Enter Role Name"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button className="bg-blue-600 text-white" onClick={handleSave}>
                {formData.teamRoleId ? "Update" : "Save"}
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
