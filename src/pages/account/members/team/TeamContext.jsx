import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const TeamContext = createContext();

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([
    {
      id: "1",
      name: "Development Team",
      type: "Engineering",
      description: "Handles software development and product releases",
      groupEmail: "devteam@example.com",
      groupPhone: "+1 (555) 123-4567",
      members: [],
      distributionChannels: [],
    }
  ]);

  const updateTeam = async (updatedTeam) => {
    setTeams((prev) =>
      prev.some((team) => team.id === updatedTeam.id)
        ? prev.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        : [...prev, { ...updatedTeam, id: uuidv4() }]
    );
    toast.success("Team updated successfully");
  };

  return (
    <TeamContext.Provider value={{ teams, updateTeam }}>
      {children}
    </TeamContext.Provider>
  );
};
