import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, X } from "lucide-react";
import { toast } from "sonner"; // Notifications

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

/**
 * Displays a custom toast with a close (X) button.
 */
function showToastWithClose(title, description) {
  toast.custom(({ id, dismiss }) => (
    <div className="flex items-center p-4 bg-white rounded-md shadow-lg border">
      <div className="flex-grow">
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-700">{description}</div>
      </div>
      <button onClick={() => dismiss(id)} className="ml-3 text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  ));
}

// Component for individual team member tile
const TeamMemberTile = ({
  member,
  index,
  teamId,
  removeMember,
  onTileClick,
  isSelected,
  userId, // Passed from parent for deletion query
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Updated API call with new route and query parameter (modifiedBy)
    fetch(`${API_URL}/Team/${teamId}/member/${member.teamMemberId}?modifiedBy=${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        // Show custom toast with close button on deletion
        showToastWithClose("Team member removed", `${member.name} has been removed`);
        setTimeout(() => {
          removeMember(index);
        }, 200);
      })
      .catch((err) => {
        console.error(err);
        setIsDeleting(false);
      });
  };

  return (
    <div
      onClick={() => onTileClick(index)}
      className={`relative group rounded-md p-4 transition-all duration-200 shadow-sm cursor-pointer 
        ${isDeleting ? "opacity-0" : "opacity-100"} 
        ${
          isSelected
            ? "border-2 border-blue-500 bg-blue-50"
            : "border border-gray-200 bg-white hover:shadow-lg hover:bg-gray-50"
        }`}
    >
      {/* Delete button only visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent tile selection toggle on delete click
          handleDelete();
        }}
        className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full 
                   text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 
                   transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>

      <div>
        <p className="font-semibold text-gray-900 text-base">{member.name}</p>
        <p className="text-sm text-gray-500">{member.role}</p>
      </div>
    </div>
  );
};

const TeamMembers = ({ team, setTeam, setActiveTab }) => {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  // Track which member tile is currently selected (by index)
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);

  const handleTileClick = (index) => {
    // Toggle selection (if already selected, deselect)
    setSelectedMemberIndex((prev) => (prev === index ? null : index));
  };

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [teamName, setTeamName] = useState(team.name || "");
  const [teamTypeId, setTeamTypeId] = useState(team.teamTypeId || "");
  const [teamDescription, setTeamDescription] = useState(team.description || "");
  const [teamLeaderId, setTeamLeaderId] = useState(team.leader || "");

  const [availableUsers, setAvailableUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableTeamTypes, setAvailableTeamTypes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAllTeamRoles();
    loadAllUsers();
    loadAllTeamTypes();
  }, []);

  useEffect(() => {
    if (team.teamId) {
      loadSingleTeam(team.teamId);
    }
  }, [team.teamId, allUsers]);

  function loadSingleTeam(teamId) {
    fetch(`${API_URL}/Team/GetTeamById/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        debugger;
        setTeam({
          teamId: data.team.teamId,
          name: data.team.name,
          description: data.team.description,
          leader: data.team.leader,
          type: data.team.type,
          teamTypeId: data.team.teamTypeId,

          members: data.members.map((m) => ({
            teamMemberId: m.teamMemberId,
            name:
              m.userName ||
              (allUsers.find((u) => u.value === m.userId)?.label || ""),
            userId: m.userId,
            role: m.role,
            roleId: m.roleId,
          })),
        });
        setTeamName(data.team.name);
        setTeamTypeId(data.team.teamTypeId);
        setTeamDescription(data.team.description);
        setTeamLeaderId(data.team.leader);
      })
      .catch(console.error);
  }

  function loadAllTeamRoles() {
    fetch(`${API_URL}/Team/GetAllTeamRole/${companyId}`)
      .then((res) => res.json())
      .then((roleData) => {
        setAvailableRoles(
          roleData.map((r) => ({
            value: String(r.teamRoleId),
            label: r.roleName,
          }))
        );
      })
      .catch(console.error);
  }

  function loadAllTeamTypes() {
    fetch(`${API_URL}/Team/GetAllTeamTypes/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableTeamTypes(
          data.map((t) => ({ value: t.typeId, label: t.typeName }))
        );
      })
      .catch(console.error);
  }

  function loadAllUsers() {
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((users) => {
        const formattedUsers = users.map((u) => ({
          value: u.userID,
          label: `${u.firstName} ${u.lastName}`,
        }));
        setAllUsers(formattedUsers);
        setAvailableUsers(formattedUsers);
      })
      .catch(console.error);
  }

  const addMember = () => {
    if (!selectedUserId || !selectedRoleId) {
      setError("Please select both User and Role.");
      return;
    }
    if (team.members.some((m) => m.userId === selectedUserId)) {
      setError("User is already added to the team.");
      return;
    }
    setError("");

    const newMember = {
      userId: selectedUserId,
      roleId: selectedRoleId,
      isSubTeam: false,
      subTeamId: 0,
      createdBy: userId,
    };

    fetch(`${API_URL}/Team/member/${team.teamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    })
      .then((res) => res.json())
      .then(() => {
        // Show custom toast notification on successful addition
        const addedUser = availableUsers.find((user) => user.value === selectedUserId);
        const addedRole = availableRoles.find((role) => role.value === selectedRoleId);
        if (team.teamId) {
          loadSingleTeam(team.teamId);
        }
          showToastWithClose(
          "Team member added",
          `${addedUser?.label || "User"} has been added as ${addedRole?.label || "Role"}`
        );
        // Reload team data after adding member
       
        // Remove the added user from availableUsers
        setAvailableUsers((prevUsers) =>
          prevUsers.filter((user) => user.value !== selectedUserId)
        );
        setSelectedUserId("");
        setSelectedRoleId("");
      })
      .catch(console.error);
  };

  // Remove a member tile after delete
  const removeMember = (index) => {
    const removedMember = team.members[index];
    setTeam((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setAvailableUsers((prevUsers) => [
      ...prevUsers,
      { value: removedMember.userId, label: removedMember.name },
    ]);
  };

  const handleSaveNext = () => {
    if (team.teamId) {
      loadSingleTeam(team.teamId);
    }
    setActiveTab(2);
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Controls for adding a member (single row) */}
      <div className="flex items-center gap-3">
        {/* Select User */}
        <select
          className="flex-1 border border-gray-300 p-2 rounded-md text-sm text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select User</option>
          {availableUsers.map((user) => (
            <option key={user.value} value={user.value}>
              {user.label}
            </option>
          ))}
        </select>

        {/* Select Role */}
        <select
          className="flex-1 border border-gray-300 p-2 rounded-md text-sm text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
        >
          <option value="">Select Role</option>
          {availableRoles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        {/* Add button */}
        <button
          className="inline-flex items-center justify-center gap-2 px-4 py-2 
                     bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={addMember}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Team Members */}
      {team.members && team.members.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold mb-3">Team Members</h3>
          <div className="grid grid-cols-2 gap-4">
            {team.members.map((member, index) => (
              <TeamMemberTile
                key={member.teamMemberId || index}
                member={member}
                index={index}
                teamId={team.teamId}
                removeMember={removeMember}
                onTileClick={handleTileClick}
                isSelected={index === selectedMemberIndex}
                userId={userId} // Pass userId to use in deletion
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={() => setActiveTab(0)}
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={handleSaveNext}
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default TeamMembers;
