import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function CreateTeamDrawer({
  isEditing,
  teamForm,
  setTeamForm,
  onSubmit,
  onClose,
  selectedUsers,
  setSelectedUsers,
  teamRoleId,
  setTeamRoleId,
}) {
  const buttonLabel = isEditing ? "Update Team" : "Add Team";
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableTeamTypes, setAvailableTeamTypes] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const { companyId } = useSelector((state) => state.AuthReducerKey);

  useEffect(() => {
    loadAllTeamTypes();
    loadAllTeamRoles();
    loadAllUsers();
  }, []);

  function loadAllTeamRoles() {
    fetch(`${API_URL}/Team/GetAllTeamRole/${companyId}`)
      .then((res) => res.json())
      .then((roleData) => {
        const rOptions = roleData.map((r) => ({
          value: r.teamRoleId, // keep as number
          label: r.roleName,
        }));
        setAvailableRoles(rOptions);
      })
      .catch(console.error);
  }

  function loadAllTeamTypes() {
    fetch(`${API_URL}/Team/GetAllTeamTypes/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        const typeOptions = data.map((t) => ({
          value: t.typeId, // keep as number
          label: t.typeName,
        }));
        setAvailableTeamTypes(typeOptions);
      })
      .catch(console.error);
  }

  function loadAllUsers() {debugger
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((users) => {
        const userOptions = users.map((u) => ({
          value: u.userID, // keep as number
          label: `${u.firstName} ${u.lastName}`,
        }));
        setAvailableUsers(userOptions);
      })
      .catch(console.error);
  }

  // React-Select styling
  const reactSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderRadius: "6px",
      padding: "0px 2px",
      minHeight: "2.5rem",
      boxShadow: "none",
      ":hover": {
        borderColor: "#999",
      },
    }),
  };

  return (
    <div className="fixed top-0 right-0 w-[400px] md:w-[600px] h-full bg-white shadow-xl border-l border-gray-200 z-50">
      {/* Drawer Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold">
          {isEditing ? "Edit Team" : "Create Team"}
        </h2>
        <Button variant="outline" onClick={onClose}>
          X
        </Button>
      </div>

      {/* Drawer Content */}
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-56px)] pb-32">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Team Name
          </label>
          <Input
            value={teamForm.name || ""}
            onChange={(e) =>
              setTeamForm({ ...teamForm, name: e.target.value })
            }
            placeholder="Enter Team Name"
          />
        </div>

        {/* Team Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Team Type
          </label>
          <ReactSelect
            styles={reactSelectStyles}
            isSearchable
            isClearable
            isMulti={false}
            options={availableTeamTypes}
            // Ensure teamForm.teamTypeId is a number that matches the 'value'
            value={
              availableTeamTypes.find(
                (opt) => opt.value === teamForm.teamTypeId
              ) || null
            }
            onChange={(option) =>
              setTeamForm({
                ...teamForm,
                teamTypeId: option ? option.value : null, // store as number
              })
            }
            placeholder="Select Team Type"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <Input
            value={teamForm.description || ""}
            onChange={(e) =>
              setTeamForm({ ...teamForm, description: e.target.value })
            }
            placeholder="Enter Description"
          />
        </div>

        {/* Leader (Single Select) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Leader
          </label>
          <ReactSelect
            styles={reactSelectStyles}
            isSearchable
            isClearable
            isMulti={false}
            options={availableUsers}
            value={
              availableUsers.find((u) => u.value === teamForm.leaderId) || null
            }
            onChange={(option) =>
              setTeamForm({
                ...teamForm,
                leaderId: option ? option.value : null, // store as number
              })
            }
            placeholder="Select Leader"
          />
        </div>

        {/* Multi-Select Users & Role (only when not editing) */}
        {!isEditing && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Users (Multi-Select)
              </label>
              <ReactSelect
                styles={reactSelectStyles}
                isMulti
                isSearchable
                isClearable
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={availableUsers}
                value={selectedUsers}
                onChange={(opts) => setSelectedUsers(opts || [])}
                placeholder="Choose users..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role for Selected Users
              </label>
              <ReactSelect
                styles={reactSelectStyles}
                isSearchable
                isClearable
                isMulti={false}
                options={availableRoles}
                value={
                  availableRoles.find((r) => r.value === teamRoleId) || null
                }
                onChange={(option) =>
                  setTeamRoleId(option ? option.value : null)
                }
                placeholder="Select Role"
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Button className="bg-blue-600 text-white" onClick={onSubmit}>
            {buttonLabel}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
