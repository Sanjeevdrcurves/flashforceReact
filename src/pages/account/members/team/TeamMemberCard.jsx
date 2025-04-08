import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, X, User, UserCog, Shield, Briefcase, UserCheck, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

const TeamMemberCard = ({ member, onRemove, onEdit, className }) => {
  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      await onRemove(member.id);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getRoleIcon = (role) => {
    if (!role) return <User className="h-4 w-4" />;

    const roleValue = role.toLowerCase();

    if (roleValue.includes("lead") || roleValue.includes("chief"))
      return <Briefcase className="h-4 w-4" />;
    if (roleValue.includes("admin")) return <UserCog className="h-4 w-4" />;
    if (roleValue.includes("manager")) return <Shield className="h-4 w-4" />;
    if (roleValue.includes("specialist")) return <UserCheck className="h-4 w-4" />;

    return <User className="h-4 w-4" />;
  };

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md group", className)}>
      <CardContent className="p-6 pt-6 relative">
        {/* Delete Button: hidden by default, visible on hover */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute -right-2 -top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20 ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30">
            {member.avatar ? (
              <AvatarImage src={member.avatar} alt={member.name} />
            ) : (
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(member.name)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="text-center space-y-1">
            <h3 className="font-medium text-lg leading-none">{member.name}</h3>
            {member.role && (
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
                {getRoleIcon(member.role)}
                <span>{member.role}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 p-4 pt-0">
        {member.email && (
          <Button variant="outline" size="sm" className="w-full justify-start text-sm" asChild>
            <a href={`mailto:${member.email}`}>
              <Mail className="h-3.5 w-3.5 mr-2 text-primary" />
              {member.email}
            </a>
          </Button>
        )}

        {member.phone && (
          <Button variant="outline" size="sm" className="w-full justify-start text-sm" asChild>
            <a href={`tel:${member.phone}`}>
              <Phone className="h-3.5 w-3.5 mr-2 text-primary" />
              {member.phone}
            </a>
          </Button>
        )}

        {/* Edit Button at the Bottom */}
        <div className="mt-2">
          <Button variant="secondary" size="sm" onClick={onEdit} className="w-full">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeamMemberCard;
