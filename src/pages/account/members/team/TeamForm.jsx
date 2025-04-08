import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TeamForm = ({ selectedTeam, onClose }) => {
  const [team, setTeam] = useState(
    selectedTeam || {
      name: "",
      type: "",
      description: "",
      email: "",
      phone: "",
    }
  );

  const handleChange = (e) => {
    setTeam({ ...team, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Team Saved:", team);
    onClose();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Team Name</Label>
        <Input id="name" name="name" value={team.name} onChange={handleChange} placeholder="Enter team name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Team Type</Label>
        <Input id="type" name="type" value={team.type} onChange={handleChange} placeholder="E.g. Marketing, Engineering" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={team.description} onChange={handleChange} placeholder="Enter team description" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Group Email</Label>
          <Input id="email" name="email" type="email" value={team.email} onChange={handleChange} placeholder="team@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Group Phone</Label>
          <Input id="phone" name="phone" type="tel" value={team.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Team</Button>
      </div>
    </div>
  );
};

export default TeamForm;
