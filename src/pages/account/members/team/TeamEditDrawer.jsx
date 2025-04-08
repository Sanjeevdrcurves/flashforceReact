import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TeamTabs from "./TeamTabs";

const TeamEditDrawer = ({ isOpen, onClose, selectedTeam }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-y-0 right-0 w-full sm:max-w-xl overflow-y-auto border-l bg-white shadow-lg transition-all">
        <DialogHeader className="mb-6">
          <DialogTitle>{selectedTeam ? "Edit Team" : "Create New Team"}</DialogTitle>
          <DialogDescription>
            Make changes to the team here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs for Team Sections */}
        <TeamTabs selectedTeam={selectedTeam} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default TeamEditDrawer;
