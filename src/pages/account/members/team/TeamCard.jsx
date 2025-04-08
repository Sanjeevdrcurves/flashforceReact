import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, Phone, Edit, Trash, Instagram, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TeamCard = ({ team, onEdit, onDelete }) => {
  // Use teamId if available, otherwise fallback to id.
  const teamIdentifier = team.teamId || team.id;

  // Generate initials from the first two words of a given name.
  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Assign a unique background color based on a given name.
  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(team.name);
  const avatarColor = getAvatarColor(team.name);

  // Process team.members: if it's a string, split it; if it's already an array, use it directly.
  let members = [];
  if (team.members) {
    if (typeof team.members === "string") {
      // Split the comma-separated names and trim them.
      const memberNames = team.members.split(",").map((name) => name.trim());
      members = memberNames.map((name, index) => ({ id: index, name }));
    } else if (Array.isArray(team.members)) {
      members = team.members;
    }
  } else {
    // Fallback dummy data if no members are provided.
    members = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Brown" },
      { id: 4, name: "Bob White" },
    ];
  }

  // Use actual channels if provided via team.channelName (as an array), otherwise fallback.
  // const channels =
  //   team.channelName && team.channelName.length > 0
  //     ? team.channelName.map((ch, idx) => {
  //         // Optionally assign icons based on channel keywords.
  //         let icon = null;
  //         const lower = ch.toLowerCase();
  //         if (lower.includes("social")) {
  //           icon = <Instagram className="h-4 w-4" />;
  //         } else if (lower.includes("phone")) {
  //           icon = <Phone className="h-4 w-4" />;
  //         } else if (lower.includes("sms")) {
  //           icon = <MessageSquare className="h-4 w-4" />;
  //         }
  //         return { id: idx, name: ch, icon };
  //       })
  //     : [
  //         { id: 1, name: "Social Media", icon: <Instagram className="h-4 w-4" /> },
  //         { id: 2, name: "Phone Calls", icon: <Phone className="h-4 w-4" /> },
  //         { id: 3, name: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  //         { id: 4, name: "+1 more" },
  //       ];

  return (
    <Card className="group rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
              {team.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {team.type}
            </CardDescription>
          </div>
          {/* Edit and Delete buttons hidden by default, show on hover */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(teamIdentifier)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-muted-foreground hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <p className="text-sm text-muted-foreground mb-4">{team.description}</p>

        {/* Contact Info on two rows */}
        <div className="flex flex-col gap-2 mb-3">
          {team.email && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{team.email}</span>
            </div>
          )}
          {team.phoneNo && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{team.phoneNo}</span>
            </div>
          )}
        </div>

        {/* Team Members Section */}
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Team members</div>
          <div className="flex -space-x-2 overflow-hidden mb-1">
            {members.map((member) => (
              <div key={member.id} className="relative group">
                <span
                  className={`relative flex shrink-0 overflow-hidden rounded-full border-2 border-background w-8 h-8 ${getAvatarColor(
                    member.name
                  )} text-white font-bold items-center justify-center`}
                >
                  {getInitials(member.name)}
                </span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channels Section */}
        {/* <div className="flex flex-wrap gap-1 mt-2">
          <div className="text-xs text-muted-foreground w-full mb-1">Channels</div>
          {channels.map((channel) => (
            <Badge
              key={channel.id}
              className="text-xs flex items-center gap-1 rounded-full border border-muted-foreground px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground bg-transparent"
            >
              {channel.icon && channel.icon}
              <span>{channel.name}</span>
            </Badge>
          ))}
        </div> */}
      </CardContent>
    </Card>
  );
};

export default TeamCard;
