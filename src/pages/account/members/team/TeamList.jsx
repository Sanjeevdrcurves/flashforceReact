import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Users, Plus } from "lucide-react";
import { useTeam } from "./TeamContext";

const TeamList = ({ onEditTeam }) => {
  const { team, loading, error } = useTeam();

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const mockTeams = team
    ? [
        team,
        { ...team, id: "2", name: "Sales Team", type: "Sales", description: "Handles sales" },
        { ...team, id: "3", name: "Support Team", type: "Support", description: "Handles support" },
      ]
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teams Management</h1>
        <Button onClick={() => onEditTeam({ id: "new", name: "", type: "", description: "", members: [] })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{team.description}</p>
              <div className="flex items-center gap-2 mb-3">
                {team.groupEmail && <Badge variant="outline"><Mail className="h-4 w-4" /> {team.groupEmail}</Badge>}
                {team.groupPhone && <Badge variant="outline"><Phone className="h-4 w-4" /> {team.groupPhone}</Badge>}
              </div>
              <div className="flex">
                {team.members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button onClick={() => onEditTeam(team)} variant="outline" className="mt-4 w-full">
                Edit Team
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
