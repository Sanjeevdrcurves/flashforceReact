import React from "react";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@/components/";

export default function AllTeamListing({
  teams,
  onCreateTeam,
  onEditTeam,
  onDeleteTeam,
  onViewTeam,
  loading,
}) {
  // Function to generate initials
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    const first = words[0]?.charAt(0).toUpperCase() || "";
    const second = words[1]?.charAt(0).toUpperCase() || "";
    return first + second;
  };

  // Predefined static colors
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];

  const columns = [
    { accessorKey: "id", header: "#" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "leader",
      header: "Leader",
      cell: ({ row }) => {
        const initials = getInitials(row.original.leader);
        const colorClass = colors[row.index % colors.length];
        return (
          <div className="flex items-center justify-center relative group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${colorClass}`}>
              {initials}
            </div>
            <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {row.original.leader}
            </span>
          </div>
        );
      },
    },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onViewTeam(row.index)}>View</Button>
          <Button variant="outline" onClick={() => onEditTeam(row.index)}>Edit</Button>
          <Button variant="destructive" onClick={() => onDeleteTeam(row.index)}>Delete</Button>
        </div>
      ),
    },
  ];

  const formattedTeams = teams.map((team, index) => ({
    id: index + 1,
    ...team,
  }));

  return (
    <div className="bg-white p-4 shadow-md border rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">All Teams</h2>
        <Button onClick={onCreateTeam}>Create Team</Button>
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
