import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@/components";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function TeamListing() {
  const { userId } = useSelector((state) => state.AuthReducerKey);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserTeams();
  }, []);

  async function loadUserTeams() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/Team/GetUserTeams/${userId}`);
      const data = await response.json();
      setTeams(data.map(team => ({
        ...team,
        teamName: team.teamName.charAt(0).toUpperCase() + team.teamName.slice(1)
      })));
    } catch (error) {
      console.error("Error loading teams:", error);
    }
    setLoading(false);
  }

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.split(" ");
    return words.length > 1
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : words[0].charAt(0).toUpperCase();
  };

  const colors = [
    "bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500",
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  ];

  const getColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderCircle = (name) => (
    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold relative group ${getColor(name)}`}>
      {getInitials(name)}
      <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {name}
      </span>
    </div>
  );

  const columns = [
    { accessorKey: "id", header: "#" },
    { accessorKey: "teamName", header: "Team Name" },
    {
      accessorKey: "leaderName",
      header: "Leader",
      cell: ({ row }) => renderCircle(row.original.leaderName),
    },
    {
      accessorKey: "users",
      header: "Users",
      cell: ({ row }) => {
        const users = row.original.users || [];
        return users.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {users.map((u, index) => (
              <div key={index}>{renderCircle(u.userName)}</div>
            ))}
          </div>
        ) : (
          "No Users"
        );
      },
    },
  ];

  const formattedTeams = teams.map((team, index) => ({
    id: index + 1,
    ...team,
  }));

  return (
    <div className="bg-white p-4 shadow-md border rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">My Teams</h2>
      </div>
      <DataGrid
        columns={columns}
        data={formattedTeams}
        pagination={{ size: 10 }}
        loading={loading}
      />
    </div>
  );
}
