import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AllTeamListing from "./AllTeamListing";
import CreateTeamDrawer from "./CreateTeamDrawer";
import ViewTeamDrawer from "./ViewTeamDrawer";
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function TeamModule() {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const [availableSubTeams, setAvailableSubTeams] = useState([]);

  const [availableUsers, setAvailableUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // For create/edit team
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingTeamIndex, setEditingTeamIndex] = useState(null);

  // For 'CreateTeamDrawer'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamRoleId, setTeamRoleId] = useState(null);

  // Store the new team form data
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    teamTypeId: null, // numeric ID
    leader: "",
    selectedTeamUser: [],
    roleId: null,
  });

  // For "ViewTeamDrawer"
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);

  // For adding individual users to a team
  // usersToAdd[teamIndex] -> the string userId
  // rolesToAdd[teamIndex] -> the string roleId
  const [usersToAdd, setUsersToAdd] = useState({});
  const [rolesToAdd, setRolesToAdd] = useState({});

  // For adding sub-teams
  const [teamsToAdd, setTeamsToAdd] = useState({});

  // For editing a single member in the "ViewTeamDrawer"
  const [editingMember, setEditingMember] = useState({
    teamIndex: null,
    memberIndex: null,
    name: "",
    userId: null,
    roleId: null, // numeric roleId
  });

  // For expanding nested sub-teams
  const [expandedSubTeams, setExpandedSubTeams] = useState({});

  const isEditing = editingTeamIndex !== null;

  // =============================================
  //               Initial Load
  // =============================================
  useEffect(() => {
    loadAllTeams();
    loadAllUsers();
  }, []);

  function loadAllTeams() {
    setIsLoading(true);
    fetch(`${API_URL}/Team/GetAllTeams/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        // data should have the complete list of teams with .type or .teamTypeName
        setTeams(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  function loadAllUsers() { debugger
    fetch(`${API_URL}/User/all?companyId=${companyId}`)
      .then((res) => res.json())
      .then((users) => {
        const userOptions = users.map((u) => ({
          value: String(u.userID), // keep as string for ReactSelect
          label: `${u.firstName} ${u.lastName}`,
        }));
        setAvailableUsers(userOptions);
      })
      .catch(console.error);
  }

  /**
   * Load a single team by ID, including all members.
   * NOTE: This is often called when we "view" the team details.
   */
  function loadSingleTeam(teamId) {
    fetch(`${API_URL}/Team/GetTeamById/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        // data.team plus data.members
        const newTeams = [...teams];
        const idx = newTeams.findIndex((t) => t.teamId === data.team.teamId);
        if (idx >= 0) {
          // CRITICAL: capture `type` (or `teamTypeName`) from the server
          // so it doesn't get "cleared."
          newTeams[idx] = {
            teamId: data.team.teamId,
            name: data.team.name,
            description: data.team.description,
            leader: data.team.leader,
            // The server might return `data.team.type` or `data.team.teamTypeName`:
            type: data.team.type,                 // store string name of the type
            teamTypeId: data.team.teamTypeId,     // store numeric ID as well
            // Re-map the members
            members: data.members.map((m) => ({
              teamMemberId: m.teamMemberId,
              name: m.userName,
              userId: m.userId,
              role: m.role,     // e.g. "Manager"
              roleId: m.roleId, // numeric
              isSubTeam: m.isSubTeam,
              subTeamMemberRoles: m.subTeamMemberRoles,
            })),
          };
          setTeams(newTeams);
        }
      })
      .catch(console.error);
  }

  // =============================================
  //           CREATE or UPDATE Team
  // =============================================
  function handleSubmitTeam() {
    if (!teamForm.name) {
      toast.error("Please enter a Team Name");
      return;
    }
    if (!teamForm.teamTypeId) {
      toast.error("Please select a Team Type");
      return;
    }

    // EDIT
    if (editingTeamIndex !== null) {
      const existing = teams[editingTeamIndex];
      const teamId = existing.teamId;

      fetch(`${API_URL}/Team/UpdateTeam/${teamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamForm.name,
          teamTypeId: teamForm.teamTypeId,
          leader: teamForm.leaderId,
          description: teamForm.description,
          selectedTeamUser: [],
          roleId: 0,
          companyId,
          createdBy: userId,
        }),
      })
        .then(() => {
          loadAllTeams();
        })
        .catch(console.error);

      setIsCreateDrawerOpen(false);
      resetTeamForm();
      return;
    }

    // CREATE NEW
    fetch(`${API_URL}/Team/CreateTeam`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: teamForm.name,
        teamTypeId: teamForm.teamTypeId,
        leader: teamForm.leaderId,
        description: teamForm.description,
        selectedTeamUser: selectedUsers.map((res) => res.value),
        roleId: teamRoleId, // numeric role ID for new members, if needed
        companyId,
        createdBy: userId,
      }),
    })
      .then(() => {
        loadAllTeams();
      })
      .catch(console.error);

    setIsCreateDrawerOpen(false);
    resetTeamForm();
  }

  function resetTeamForm() {
    setTeamForm({
      name: "",
      description: "",
      teamTypeId: null,
      leader: "",
    });
    setSelectedUsers([]);
    setTeamRoleId(null);
    setEditingTeamIndex(null);
  }

  // =============================================
  //             Manage Team Listing
  // =============================================
  function startCreateTeam() {
    resetTeamForm();
    setIsCreateDrawerOpen(true);
  }

  function startEditTeam(teamIndex) {
    const t = teams[teamIndex];
    // Optionally fetch fresh details for the team
    fetch(`${API_URL}/Team/GetTeamDetails/${t.teamId}`)
      .then((res) => res.json())
      .then((data) => {
        // data[0] might contain details about the team
        // e.g. { name: "Team A", description: "...", typeId: 2, leaderId: 1003 }
        setTeamForm({
          name: data[0].name,
          description: data[0].description,
          teamTypeId: data[0].typeId,
          leaderId: data[0].leaderId,
        });
        setSelectedUsers([]);
        setTeamRoleId(null);
        setEditingTeamIndex(teamIndex);
        setIsCreateDrawerOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  function handleDeleteTeam(teamIndex) {
    const teamId = teams[teamIndex].teamId;
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    fetch(`${API_URL}/Team/DeleteTeam`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId,
        modifiedBy: userId,
      }),
    })
      .then(() => {
        loadAllTeams();
      })
      .catch(console.error);
  }

  // =============================================
  //           View Single Team (Drawer)
  // =============================================
  function openDrawer(teamIndex) {
    setSelectedTeamIndex(teamIndex);
    const teamId = teams[teamIndex].teamId;
    // Refresh that single team from the server
    loadSingleTeam(teamId);
  }

  function closeDrawer() {
    setSelectedTeamIndex(null);
  }

  const selectedTeam =
    selectedTeamIndex !== null ? teams[selectedTeamIndex] : null;

  // =============================================
  //           Add / Delete Team Member
  // =============================================
  function handleAddUserToTeam(teamIndex) {
    const selectedUserId = parseInt(usersToAdd[teamIndex], 10);
    const selectedRoleId = parseInt(rolesToAdd[teamIndex], 10);

    if (!selectedUserId || !selectedRoleId) {
      toast.error("Select user and role before adding.");
      return;
    }

    const teamId = teams[teamIndex].teamId;
    fetch(`${API_URL}/Team/member/${teamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUserId,
        roleId: selectedRoleId,
        isSubTeam: false,
        subTeamId:0,
        createdBy: userId,
      }),
    })
      .then(() => {
        loadSingleTeam(teamId);
      })
      .catch(console.error);

    // Clear the ReactSelect states
    setUsersToAdd({ ...usersToAdd, [teamIndex]: "" });
    setRolesToAdd({ ...rolesToAdd, [teamIndex]: "" });
  }

  function handleDeleteMember(teamIndex, memberIndex) {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    const teamId = teams[teamIndex].teamId;
    const memberObj = teams[teamIndex].members[memberIndex];

    if (memberObj.teamMemberId) {
      fetch(
        `${API_URL}/Team/${teamId}/member/${memberObj.teamMemberId}?modifiedBy=${userId}`,
        { method: "DELETE" }
      )
        .then(() => loadSingleTeam(teamId))
        .catch(console.error);
    }
  }

  // =============================================
  //           Edit Single Member (Drawer)
  // =============================================
  function startEditMember(teamIndex, memberIndex) {
    const m = teams[teamIndex].members[memberIndex];
    setEditingMember({
      teamIndex,
      memberIndex,
      name: m.name,
      userId: m.userId, // numeric
      roleId: m.roleId, // numeric
    });
  }

  function cancelEditMember() {
    setEditingMember({
      teamIndex: null,
      memberIndex: null,
      name: "",
      userId: null,
      roleId: null,
    });
  }

  function saveEditMember() {
    const { teamIndex, memberIndex, userId: editedUserId, roleId: editedRoleId } =
      editingMember;
    const teamId = teams[teamIndex].teamId;
    const memberObj = teams[teamIndex].members[memberIndex];

    if (memberObj.teamMemberId) {
      fetch(`${API_URL}/Team/${teamId}/member/${memberObj.teamMemberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editedUserId,
          roleId: editedRoleId,
          isSubTeam: memberObj.isSubTeam,
          createdBy: userId,
        }),
      })
        .then(() => loadSingleTeam(teamId))
        .catch(console.error);
    }
    cancelEditMember();
  }

  // =============================================
  //          Sub-Team (Nested) Ops
  // =============================================
  function toggleSubTeam(parentTeamIndex, memberIndex) {
    const key = `${parentTeamIndex}-${memberIndex}`;
    setExpandedSubTeams((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function getSubTeamObj(teamName) {
    return teams.find((t) => t.name === teamName);
  }

  function handleChangeSubTeamUserRole(parentTeamIndex, memberIndex, userName, newRole) {
    // This example just updates local state with the "override" roles
    const updated = [...teams];
    const subTeamMember = updated[parentTeamIndex].members[memberIndex];
    if (!subTeamMember.subTeamMemberRoles) {
      subTeamMember.subTeamMemberRoles = {};
    }
    subTeamMember.subTeamMemberRoles[userName] = newRole;
    setTeams(updated);
  }

  function handleSaveSubTeamRoles(parentTeamIndex, memberIndex) {
    const subTeamName = teams[parentTeamIndex].members[memberIndex].name;
    toast.success(`Saved parent-level role overrides for sub-team '${subTeamName}'.`);
  }

  // function getAvailableSubTeams(currentTeamIndex) {
  //   debugger
  //   const teamId = teams[teamIndex].teamId;

  //   fetch(`${API_URL}/Team/GetTeamListing/${companyId}/${teamId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       debugger
  //       // data should have the complete list of teams with .type or .teamTypeName
  //       return teams
  //       .filter((_, idx) => idx !== currentTeamIndex)
  //       .map((t) => ({ value: t.name, label: t.name }));
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setIsLoading(false);
  //     });
   
  // }

  function getAvailableSubTeams(currentTeamIndex) {
    if (!teams[currentTeamIndex]) return [];
  
    const teamId = teams[currentTeamIndex].teamId;
  
    fetch(`${API_URL}/Team/GetTeamListing/${companyId}/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        const teamOptions = data.map((team) => ({
          value: team.teamId,  // Correctly storing TeamId
          label: team.name,  // Using the Name from API
        }));
        setAvailableSubTeams(teamOptions);
      })
      .catch(console.error);
    
    return availableSubTeams;  // Ensure returning the fetched data
  }
  

  function handleAddTeamToTeam(teamIndex) {
    console.log(selectedTeam);
    
    debugger
    const subTeamId = teamsToAdd[teamIndex];
    if (!subTeamId) {
      alert("Please select a team to add.");
      return;
    }
   // const subTeamObj = teams.find((t) => t.name === subTeamName);
    
    
    fetch(`${API_URL}/Team/member/${selectedTeam.teamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 0,
        roleId: 0,
        isSubTeam: true,
        subTeamId:subTeamId,
        createdBy: userId,
      }),
    })
      .then(() => {
        loadSingleTeam(selectedTeam.teamId);
      })
      .catch(console.error);

    // const newSubTeamMemberRoles = {};
    // if (subTeamObj?.members) {
    //   subTeamObj.members.forEach((mem) => {
    //     newSubTeamMemberRoles[mem.name] = "Member";
    //   });
    // }

    // const updated = [...teams];
    // updated[teamIndex].members.push({
    //   name: subTeamName,
    //   roleId: 3, // example
    //   isSubTeam: true,
    //   subTeamMemberRoles: newSubTeamMemberRoles,
    // });
    // setTeams(updated);
    // setTeamsToAdd({ ...teamsToAdd, [teamIndex]: "" });
  }

  /**
   * Return an array of user options for the given team.
   * E.g. you could exclude users who are already on the team,
   * but here we just return the entire list.
   */
  function getAvailableUsersForTeam(teamIndex) {
    if (!teams[teamIndex]) return [];
    return availableUsers;
  }

  // For user color circles
  const COLOR_PALETTE = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-orange-400",
  ];
  function getColorForUser(userName) {
    let sum = 0;
    for (let i = 0; i < userName.length; i++) {
      sum += userName.charCodeAt(i);
    }
    return COLOR_PALETTE[sum % COLOR_PALETTE.length];
  }

  // =============================================
  //                Render
  // =============================================
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 relative">
      {isLoading && <div className="text-gray-500">Loading...</div>}

      {/* A listing of all teams: name, type, etc. */}
      <AllTeamListing
        teams={teams}
        onCreateTeam={startCreateTeam}
        onEditTeam={startEditTeam}
        onDeleteTeam={handleDeleteTeam}
        onViewTeam={openDrawer}
      />

      {isCreateDrawerOpen && (
        <CreateTeamDrawer
          isEditing={isEditing}
          teamForm={teamForm}
          setTeamForm={setTeamForm}
          onSubmit={handleSubmitTeam}
          onClose={() => setIsCreateDrawerOpen(false)}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          teamRoleId={teamRoleId}
          setTeamRoleId={setTeamRoleId}
        />
      )}

      {/* When a team is selected, open the "ViewTeamDrawer" */}
      {selectedTeam && (
        <ViewTeamDrawer
          team={selectedTeam}
          onClose={closeDrawer}
          teams={teams}
          editingMember={editingMember}
          setEditingMember={setEditingMember}
          expandedSubTeams={expandedSubTeams}
          usersToAdd={usersToAdd}
          rolesToAdd={rolesToAdd}
          teamsToAdd={teamsToAdd}
          handleAddUserToTeam={handleAddUserToTeam}
          handleDeleteMember={handleDeleteMember}
          startEditMember={startEditMember}
          cancelEditMember={cancelEditMember}
          saveEditMember={saveEditMember}
          toggleSubTeam={toggleSubTeam}
          getSubTeamObj={getSubTeamObj}
          handleChangeSubTeamUserRole={handleChangeSubTeamUserRole}
          handleSaveSubTeamRoles={handleSaveSubTeamRoles}
          handleAddTeamToTeam={handleAddTeamToTeam}
          setUsersToAdd={setUsersToAdd}
          setRolesToAdd={setRolesToAdd}
          setTeamsToAdd={setTeamsToAdd}
          getAvailableUsersForTeam={getAvailableUsersForTeam}
          getAvailableSubTeams={getAvailableSubTeams}
          getColorForUser={getColorForUser}
          availableSubTeams={availableSubTeams}
        />
      )}
    </div>
  );
}
