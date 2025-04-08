import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner"; // Notifications

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TeamGeneralForm = ({ team, setTeam, setActiveTab, onCancel }) => {
  const { companyId, userId } = useSelector((state) => state.AuthReducerKey);

  const [formData, setFormData] = useState(team || {});
  const [availableTeamTypes, setAvailableTeamTypes] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Load options for team types and users
  useEffect(() => {
    loadAllTeamTypes();
    loadAllUsers();
  }, []);

  // Update formData when team prop changes
  useEffect(() => {
    setFormData(team || {});
  }, [team]);

  // When editing an existing team and options are loaded, fetch team data.
  useEffect(() => {
    const effectiveTeamId = team?.teamId || team?.id;
    if (effectiveTeamId && availableTeamTypes.length > 0 && availableUsers.length > 0) {
      loadSingleTeam(effectiveTeamId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team?.teamId, team?.id, availableTeamTypes, availableUsers]);

  function loadAllTeamTypes() {
    fetch(`${API_URL}/Team/GetAllTeamTypes/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        // Convert typeId to string for consistency.
        setAvailableTeamTypes(
          data.map((t) => ({ value: t.typeId.toString(), label: t.typeName }))
        );
      })
      .catch(console.error);
  }

  function loadAllUsers() {
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((users) => {
        // Convert userID to string.
        setAvailableUsers(
          users.map((u) => ({
            value: u.userID.toString(),
            label: `${u.firstName} ${u.lastName}`,
          }))
        );
      })
      .catch(console.error);
  }

  function loadSingleTeam(teamId) {
    fetch(`${API_URL}/Team/GetTeamById/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        debugger;
        const updatedTeam = {
          teamId: data.team.teamId,
          name: data.team.name,
          description: data.team.description,
          leader: data.team.leaderId ? data.team.leaderId.toString() : "",
          type: data.team.type,
          teamTypeId: data.team.typeId ? data.team.typeId.toString() : "",
          email: data.team.email,
          phone: data.team.phoneNo,
          members: data.members.map((m) => ({
            teamMemberId: m.teamMemberId,
            name:
              m.userName ||
              (availableUsers.find((u) => u.value === m.userId.toString())?.label || ""),
            userId: m.userId.toString(),
            role: m.role,
            roleId: m.roleId,
          })),
        };
        setFormData(updatedTeam);
        setTeam(updatedTeam);
      })
      .catch(console.error);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Team Name is required");
      return;
    }
    if (!formData.teamTypeId) {
      toast.error("Team Type is required");
      return;
    }
    if (!formData.leader) {
      toast.error("Team Leader is required");
      return;
    }
  
    const requestBody = {
      teamId: formData.teamId || null,
      name: formData.name,
      description: formData.description,
      teamTypeId: formData.teamTypeId,
      leader: formData.leader,
      email: formData.email,
      phoneNo: formData.phone,
      companyId: companyId,
      createdBy: userId,
    };
  
    const isUpdate = Boolean(formData.teamId);
    const apiUrl = isUpdate
      ? `${API_URL}/Team/UpdateTeam/${formData.teamId}`
      : `${API_URL}/Team/CreateTeam`;
  
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        let newTeamId;
        if (isUpdate) {
          // For update, assume the existing id remains valid.
          newTeamId = formData.teamId;
          toast.success("Team updated successfully!");
        } else {
          newTeamId = data.teamId ? data.teamId : data;
          if (!newTeamId || newTeamId === 0) {
            toast.error("API returned an invalid teamId (0).");
            return;
          }
          toast.success("Team saved successfully!");
        }
        const updatedTeam = { ...formData, teamId: newTeamId };
        setFormData(updatedTeam);
        setTeam(updatedTeam);
        setActiveTab(1);
      })
      .catch(() => {
        toast.error("Failed to save team. Please try again.");
      });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Team Name</label>
        <input
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Enter team name"
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Team Type</label>
        <select
          name="teamTypeId"
          value={formData.teamTypeId || ""}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Select Team Type</option>
          {availableTeamTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Enter team description"
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Team Leader</label>
        <select
          name="leader"
          value={formData.leader || ""}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Select Team Leader</option>
          {availableUsers.map((user) => (
            <option key={user.value} value={user.value}>
              {user.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Group Email</label>
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Group Phone</label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2 mt-4">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform hover:scale-105"
          onClick={handleSave}
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default TeamGeneralForm;
