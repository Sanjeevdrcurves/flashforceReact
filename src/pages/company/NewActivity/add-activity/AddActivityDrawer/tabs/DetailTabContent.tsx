
import React from "react";
import { DetailsTab } from "../DetailsTab";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ReminderSelector } from "../../ReminderSelector";
import { ParticipantsList } from "../../ParticipantsList";

interface DetailTabContentProps {
  formState: any;
}

export const DetailTabContent: React.FC<DetailTabContentProps> = ({
  formState,
}) => {
  // Determine which fields to show based on activity type
  const needsParticipants = ["meeting", "call", "service appointment"].includes(formState.type);

  return (
    <div className="space-y-6">
      <DetailsTab 
        type={formState.type}
        status={formState.status}
        setStatus={formState.setStatus}
        priority={formState.priority || "medium"}
        setPriority={formState.setPriority}
        availability={formState.availability || "busy"}
        setAvailability={formState.setAvailability}
        description={formState.description || ""}
        setDescription={formState.setDescription}
        videoCallPlatform={formState.videoCallPlatform || "none"}
        setVideoCallPlatform={formState.setVideoCallPlatform}
        videoCallUrl={formState.videoCallUrl || ""}
        setVideoCallUrl={formState.setVideoCallUrl}
        tasks={formState.tasks || []}
        addTask={formState.addTask}
        removeTask={formState.removeTask}
        updateTask={formState.updateTask}
        tags={formState.tags || []}
        addTag={formState.addTag}
        removeTag={formState.removeTag}
        comments={formState.comments || []}
        addComment={formState.addComment}
        removeComment={formState.removeComment}
        
        // Service appointment specific props
        patientBalance={formState.patientBalance}
        setPatientBalance={formState.setPatientBalance}
        paperworkCompleted={formState.paperworkCompleted}
        setPaperworkCompleted={formState.setPaperworkCompleted}
        assignedServices={formState.assignedServices}
        addAssignedService={formState.addAssignedService}
        removeAssignedService={formState.removeAssignedService}
        assignedProducts={formState.assignedProducts}
        addAssignedProduct={formState.addAssignedProduct}
        removeAssignedProduct={formState.removeAssignedProduct}
        servicesOfInterest={formState.servicesOfInterest}
        addServiceOfInterest={formState.addServiceOfInterest}
        removeServiceOfInterest={formState.removeServiceOfInterest}
        productsOfInterest={formState.productsOfInterest}
        addProductOfInterest={formState.addProductOfInterest}
        removeProductOfInterest={formState.removeProductOfInterest}
      />

      <Separator className="my-4" />
      
      {/* Reminders Section (moved from ScheduleTab) */}
      <div>
        <h3 className="text-sm font-medium mb-3">Reminders</h3>
        <ReminderSelector 
          reminders={formState.reminders || []}
          onAdd={formState.addReminder}
          onRemove={formState.removeReminder}
        />
      </div>
      
      <Separator className="my-4" />
      
      {/* Owner Section (moved from ScheduleTab) */}
      <div className="space-y-2">
        <Label htmlFor="owner" className="text-sm font-medium">Owner</Label>
        <Input
          id="owner"
          placeholder="Activity owner"
          value={formState.owner || ""}
          onChange={(e) => formState.setOwner(e.target.value)}
          className="h-9"
        />
      </div>
      
      {/* Participants Section (moved from ScheduleTab) */}
      {needsParticipants && (
        <>
          <Separator className="my-4" />
          <ParticipantsList
            participants={formState.participants || []}
            onAdd={formState.addParticipant}
            onRemove={formState.removeParticipant}
            onUpdate={formState.updateParticipant}
          />
        </>
      )}
    </div>
  );
};
