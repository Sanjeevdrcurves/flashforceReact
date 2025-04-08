import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner"; // Notifications
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import TeamCard from "./TeamCard";
import TeamTabs from "./TeamTabs";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const Main = () => {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  const loadAllTeams = () => {
    if (!companyId) return;
    setIsLoading(true);
    fetch(`${API_URL}/Team/GetAllTeams/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAllTeams();
  }, [companyId]);

  // When editing a team, fetch the full team data using its teamId.
  const handleEditTeam = (team) => {
    fetch(`${API_URL}/Team/GetTeamById/${team.teamId}`)
      .then((res) => res.json())
      .then((data) => {
        // Map the returned data to the format expected by the form.
        const updatedTeam = {
          id: data.team.teamId,               // Local reference.
          teamId: data.team.teamId,           // Also set teamId.
          name: data.team.name,
          teamTypeId: data.team.teamTypeId,   // For dropdown.
          description: data.team.description,
          email: data.team.email,
          phoneNo: data.team.phoneNo,         // For contact info.
          leader: data.team.leader,
          channelName: data.team.channelName, // Updated: use actual channel names.
          members: data.members,              // Assuming members come as an array.
        };

        setCurrentTeam(updatedTeam);
        setIsDrawerOpen(true);
      })
      .catch((err) => {
        console.error("Error fetching team details:", err);
      });
  };

  const handleAddTeam = () => {
    setCurrentTeam({
      id: null,
      name: "",
      type: "",
      description: "",
      email: "",
      phoneNo: "",
      members: [],
      channelName: [],
      distributionType: "even",
      weights: {},
    });
    setIsDrawerOpen(true);
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      fetch(`${API_URL}/Team/DeleteTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TeamId: teamId, ModifiedBy: userId }),
      })
        .then((res) => res.json())
        .then((success) => {
          loadAllTeams();
          // Display a toast notification on successful deletion.
          toast("Team deleted", {
            description: "The team was successfully deleted.",
          });
        })
        .catch((err) => {
          console.error("Error deleting team:", err);
          toast("Error deleting team", {
            description: "There was an error deleting the team.",
          });
        });
    }
  };

  const handleSaveTeam = (updatedTeam) => {
    if (!updatedTeam.name.trim()) {
      alert("Team name is required!");
      return;
    }

    if (updatedTeam.id) {
      // Update existing team locally.
      setTeams(teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
    } else {
      // Create new team (dummy id generated here).
      const newTeam = { ...updatedTeam, id: teams.length + 1 };
      setTeams([...teams, newTeam]);
    }

    setIsDrawerOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Teams Management</h1>
        <Button onClick={handleAddTeam} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading teams...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.length > 0 ? (
            teams.map((team) => (
              <TeamCard
                key={team.teamId}
                team={team}
                onEdit={() => handleEditTeam(team)}
                onDelete={() => handleDeleteTeam(team.teamId)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No teams found.</p>
          )}
        </div>
      )}

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="fixed inset-y-0 right-0 w-full sm:max-w-xl overflow-y-auto border-l bg-white shadow-lg transition-all">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              {currentTeam?.id ? "Edit Team" : "Create New Team"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Make changes to the team here. Click save when you're done.
            </p>
          </div>
          <TeamTabs
            selectedTeam={currentTeam}
            onSave={handleSaveTeam}
            onClose={() => setIsDrawerOpen(false)}
            loadAllTeams={loadAllTeams}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Main;
