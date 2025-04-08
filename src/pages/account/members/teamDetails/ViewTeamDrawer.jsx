import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import ReactSelect from "react-select";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function ViewTeamDrawer({
  team,
  onClose,
  teams,
  editingMember,
  setEditingMember,
  expandedSubTeams,
  usersToAdd,
  rolesToAdd,
  teamsToAdd,
  handleAddUserToTeam,
  handleDeleteMember,
  startEditMember,
  cancelEditMember,
  saveEditMember,
  toggleSubTeam,
  getSubTeamObj,
  handleChangeSubTeamUserRole,
  handleSaveSubTeamRoles,
  handleAddTeamToTeam,
  setUsersToAdd,
  setRolesToAdd,
  setTeamsToAdd,
  getAvailableUsersForTeam,
  getAvailableSubTeams,
  getColorForUser,
  availableSubTeams
}) {
  // minimal style for ReactSelect
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

  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const { companyId } = useSelector((state) => state.AuthReducerKey);

  useEffect(() => {
    loadAllTeamRoles();
    loadAllUsers();
  }, []);

  function loadAllTeamRoles() {
    fetch(`${API_URL}/Team/GetAllTeamRole/${companyId}`)
      .then((res) => res.json())
      .then((roleData) => {
        const rOptions = roleData.map((r) => ({
          value: parseInt(r.teamRoleId, 10),
          label: r.roleName,
        }));
        setAvailableRoles(rOptions);
      })
      .catch(console.error);
  }

  function loadAllUsers() {debugger
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((users) => {
        const userOptions = users.map((u) => ({
          value: String(u.userID),
          label: `${u.firstName} ${u.lastName}`,
        }));
        setAvailableUsers(userOptions);
      })
      .catch(console.error);
  }

  // Find team’s index in the array
  const selectedTeamIndex = teams.findIndex((t) => t === team);

  return (
    <div className="fixed top-0 right-0 w-[400px] md:w-[600px] h-full bg-white shadow-xl border-l border-gray-200 z-50">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold">Team Details</h2>
        <Button variant="outline" onClick={onClose}>
          X
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)] pb-32">
        {/* Team Basic Info */}
        <p>
          <strong>Name:</strong> {team.name}
        </p>
        <p>
          <strong>Type:</strong> {team.type || "—"}
        </p>
        <p>
          <strong>Leader:</strong> {team.leader || "—"}
        </p>
        <p>
          <strong>Description:</strong> {team.description}
        </p>

        {/* =======================================
            ADD USER to TEAM
        ======================================== */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-base font-semibold mb-2">Add User</h3>
          <div className="flex flex-col gap-2">
            {/* Select user */}
            <ReactSelect
              styles={reactSelectStyles}
              className="text-sm"
              isSearchable
              isClearable
              isMulti={false}
              options={getAvailableUsersForTeam(selectedTeamIndex)}
              value={
                usersToAdd[selectedTeamIndex]
                  ? {
                      value: usersToAdd[selectedTeamIndex],
                      label:
                        getAvailableUsersForTeam(selectedTeamIndex)?.find(
                          (u) => u.value === usersToAdd[selectedTeamIndex]
                        )?.label || "",
                    }
                  : null
              }
              onChange={(option) =>
                setUsersToAdd({
                  ...usersToAdd,
                  [selectedTeamIndex]: option ? option.value : "",
                })
              }
              placeholder="Select User"
            />

            {/* Select role */}
            <ReactSelect
              styles={reactSelectStyles}
              className="text-sm"
              isSearchable
              isClearable
              isMulti={false}
              options={availableRoles}
              value={
                rolesToAdd[selectedTeamIndex]
                  ? {
                      value: parseInt(rolesToAdd[selectedTeamIndex], 10),
                      label:
                        availableRoles.find(
                          (r) =>
                            r.value === parseInt(rolesToAdd[selectedTeamIndex], 10)
                        )?.label || "",
                    }
                  : null
              }
              onChange={(option) =>
                setRolesToAdd({
                  ...rolesToAdd,
                  [selectedTeamIndex]: option ? option.value.toString() : "",
                })
              }
              placeholder="Select Role"
            />

            <Button
              className="bg-green-600 text-white"
              onClick={() => handleAddUserToTeam(selectedTeamIndex)}
            >
              Add User
            </Button>
          </div>
        </div>

        {/* =======================================
            ADD SUB-TEAM
        ======================================== */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-base font-semibold mb-2">Add Existing Team</h3>
          <div className="flex flex-col gap-2">
            {/* <ReactSelect
              styles={reactSelectStyles}
              className="text-sm"
              isSearchable
              isClearable
              isMulti={false}
              options={getAvailableSubTeams(selectedTeamIndex)}
              value={
                teamsToAdd[selectedTeamIndex]
                  ? {
                      value: teamsToAdd[selectedTeamIndex],
                      label: teamsToAdd[selectedTeamIndex],
                    }
                  : null
              }
              onChange={(option) =>
                setTeamsToAdd({
                  ...teamsToAdd,
                  [selectedTeamIndex]: option ? option.value : "",
                })
              }
              placeholder="Select a Team"
            /> */}
<ReactSelect
  styles={reactSelectStyles}
  isSearchable
  isClearable
  isMulti={false}
  options={getAvailableSubTeams(selectedTeamIndex)}  // Uses API Data
  value={teamsToAdd[selectedTeamIndex]
    ? availableSubTeams.find((t) => t.value === teamsToAdd[selectedTeamIndex]) || null
    : null
  }
  onChange={(option) =>
    setTeamsToAdd({
      ...teamsToAdd,
      [selectedTeamIndex]: option ? option.value : null,
    })
  }
  placeholder="Select a Team"
/>

            <Button
              className="bg-green-600 text-white"
              onClick={() => handleAddTeamToTeam(selectedTeamIndex)}
            >
              Add Team
            </Button>
          </div>
        </div>

        {/* =======================================
            TEAM MEMBERS LIST
        ======================================== */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-base font-semibold mb-2">Members</h3>
          <Table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-left font-medium text-gray-700">
                  User / Team
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-700">
                  Role
                </th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {team?.members?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-2 py-2 text-center text-gray-500">
                    No members yet.
                  </td>
                </tr>
              )}

              {team?.members?.map((m, memberIndex) => {
                if (m.isSubTeam) {
                  // This row is a sub-team pointer
                  const subTeamKey = `${selectedTeamIndex}-${memberIndex}`;
                  const subTeamExpanded = expandedSubTeams[subTeamKey] || false;
                  const colorClass = getColorForUser(m.name);

                  return (
                    <React.Fragment key={memberIndex}>
                      <tr className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-2 py-2 text-gray-800">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm font-bold ${colorClass}`}
                            >
                              {m.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-blue-600">
                              [Team] {m.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-gray-800">{m.role}</td>
                        <td className="px-2 py-2 flex gap-1">
                          {/* <Button
                            variant="outline"
                            onClick={() => toggleSubTeam(selectedTeamIndex, memberIndex)}
                          >
                            {subTeamExpanded ? "Hide" : "Show"} Members
                          </Button> */}
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteMember(selectedTeamIndex, memberIndex)
                            }
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                      {/* Show nested members if expanded */}
                      {subTeamExpanded && (
                        <tr className="border-b last:border-b-0">
                          <td colSpan={3} className="p-2 bg-gray-50">
                            {renderSubTeamMembers(selectedTeamIndex, memberIndex, m)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }

                // Check if we are editing this member
                const isEditingMemberHere =
                  editingMember.teamIndex === selectedTeamIndex &&
                  editingMember.memberIndex === memberIndex &&
                  !m.isSubTeam;

                if (isEditingMemberHere) {
                  const colorClass = getColorForUser(editingMember.name);
                  // Editing a user
                  return (
                    <tr key={memberIndex} className="border-b last:border-b-0">
                      <td className="px-2 py-2"><div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm font-bold ${colorClass}`}
                          >
                            {editingMember.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{editingMember.name}</span>
                        </div>
                        {/* <Input
                          value={editingMember.name}
                          onChange={(e) =>
                            setEditingMember((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        /> */}
                      </td>
                      <td className="px-2 py-2">
                        {/* Role via ReactSelect */}
                        <ReactSelect
                          styles={reactSelectStyles}
                          className="text-sm"
                          isSearchable
                          isClearable
                          isMulti={false}
                          options={availableRoles}
                          value={
                            editingMember.roleId
                              ? availableRoles.find(
                                  (r) => r.value === editingMember.roleId
                                ) || null
                              : null
                          }
                          onChange={(option) =>
                            setEditingMember((prev) => ({
                              ...prev,
                              roleId: option ? option.value : null,
                            }))
                          }
                          placeholder="Select Role"
                        />
                      </td>
                      <td className="px-2 py-2 flex gap-1">
                        <Button
                          className="bg-blue-600 text-white"
                          onClick={saveEditMember}
                        >
                          Save
                        </Button>
                        <Button variant="outline" onClick={cancelEditMember}>
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  );
                }

                // Normal user row
                if (m.name) {
                  const colorClass = getColorForUser(m.name);
                  return (
                    <tr
                      key={memberIndex}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-2 py-2 text-gray-800">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm font-bold ${colorClass}`}
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{m.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-gray-800">{m.role}</td>
                      <td className="px-2 py-2 flex gap-1">
                        <Button
                          variant="outline"
                          onClick={() => startEditMember(selectedTeamIndex, memberIndex)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleDeleteMember(selectedTeamIndex, memberIndex)
                          }
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                }

                // fallback if name is undefined
                return null;
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );

  // ============================================
  //    RENDER SUB-TEAM MEMBERS (Nested Table)
  // ============================================
  function renderSubTeamMembers(parentTeamIndex, memberIndex, subTeamMember) {
    const subTeamObj = getSubTeamObj(subTeamMember.name);
    if (!subTeamObj) {
      return <div className="text-sm text-gray-500">Sub-team not found.</div>;
    }

    if (!subTeamMember.subTeamMemberRoles) {
      subTeamMember.subTeamMemberRoles = {};
    }

    return (
      <div className="bg-white p-2 rounded shadow">
        <p className="text-sm font-semibold mb-2">
          Members of {subTeamObj.name} (Custom Roles for{" "}
          {teams[parentTeamIndex]?.name})
        </p>
        <Table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-2 text-left font-medium text-gray-700">
                User
              </th>
              <th className="px-2 py-2 text-left font-medium text-gray-700">
                Role in {subTeamObj.name}
              </th>
              <th className="px-2 py-2 text-left font-medium text-gray-700">
                Role in Parent
              </th>
            </tr>
          </thead>
          <tbody>
            {subTeamObj.members.length === 0 && (
              <tr>
                <td colSpan={3} className="px-2 py-2 text-center text-gray-500">
                  No members in sub-team.
                </td>
              </tr>
            )}
            {subTeamObj.members.map((mObj, i) => {
              const colorClass = getColorForUser(mObj.name);
              const overrideRole = subTeamMember.subTeamMemberRoles[mObj.name];
              const actualSubTeamRole = overrideRole || mObj.role;

              return (
                <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${colorClass}`}
                      >
                        {mObj.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{mObj.name}</span>
                    </div>
                  </td>
                  {/* Original sub-team role */}
                  <td className="px-2 py-2 text-gray-700">{mObj.role}</td>
                  <td className="px-2 py-2 text-gray-700">
                    <ReactSelect
                      styles={reactSelectStyles}
                      className="text-sm"
                      isSearchable
                      isClearable
                      isMulti={false}
                      options={availableRoles}
                      value={
                        // If 'actualSubTeamRole' is a string from the server,
                        // we might match by .label:
                        availableRoles.find((r) => r.label === actualSubTeamRole) ||
                        null
                      }
                      onChange={(option) =>
                        handleChangeSubTeamUserRole(
                          parentTeamIndex,
                          memberIndex,
                          mObj.name,
                          option ? option.label : ""
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="text-right mt-2">
          <Button
            className="bg-blue-600 text-white"
            onClick={() => handleSaveSubTeamRoles(parentTeamIndex, memberIndex)}
          >
            Save Roles
          </Button>
        </div>
      </div>
    );
  }
}
