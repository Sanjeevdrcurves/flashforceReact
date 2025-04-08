
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { useActivityForm } from "../hooks/useActivityForm";
import { DrawerHeader, DrawerFooterButtons } from "./shared";
import { ActivityTabs } from "./ActivityTabs";
import { ActivityTypeAndTitle } from "./ActivityTypeAndTitle";
import { useDeviceType } from "@/hooks/use-mobile";

export const AddActivityDrawer = ({
  isOpen,
  onClose,
  onSave,
  contactId,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showCalendarView, setShowCalendarView] = useState(false);
  const formState = useActivityForm(contactId);
  const deviceType = useDeviceType();

  useEffect(() => {
    if (isOpen) {
      formState.resetForm();
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!formState.title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the activity.",
        variant: "destructive",
      });
      return;
    }

    const activity = formState.getFormData();
    onSave(activity);
    
    toast({
      title: "Activity saved",
      description: "The activity has been successfully created.",
    });
    
    onClose();
  };

  // Determine drawer width based on device type
  const getDrawerWidth = () => {
    switch (deviceType) {
      case "mobile":
        return "100%";
      case "tablet":
        return "85%";
      case "desktop":
        return "1000px";
      default:
        return "1000px";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="p-0 h-full border-l overflow-hidden flex flex-col"
        style={{ width: getDrawerWidth(), maxWidth: "100vw" }}
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="border-b border-border px-6 py-4 flex-shrink-0">
            <DrawerHeader />
          </SheetHeader>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              <ActivityTypeAndTitle 
                type={formState.type}
                title={formState.title}
                startDate={formState.startDate}
                dueDate={formState.dueDate}
                startTime={formState.startTime}
                dueTime={formState.dueTime}
                participants={formState.participants}
                showCalendarView={showCalendarView}
                setType={formState.setType}
                setTitle={formState.setTitle}
                setStartDate={formState.setStartDate}
                setDueDate={formState.setDueDate}
                setStartTime={formState.setStartTime}
                setDueTime={formState.setDueTime}
                setShowCalendarView={setShowCalendarView}
                isRecurring={formState.isRecurring}
                setIsRecurring={formState.setIsRecurring}
                reminders={formState.reminders}
                addReminder={formState.addReminder}
                removeReminder={formState.removeReminder}
                // Pass status, priority, and availability props
                status={formState.status}
                setStatus={formState.setStatus}
                priority={formState.priority}
                setPriority={formState.setPriority}
                availability={formState.availability}
                setAvailability={formState.setAvailability}
              />
              
              <ActivityTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formState={formState}
                showCalendarView={showCalendarView}
                setShowCalendarView={setShowCalendarView}
              />
            </div>
          </div>
          
          <SheetFooter className="border-t border-border px-6 py-4 flex-shrink-0">
            <DrawerFooterButtons onClose={onClose} onSave={handleSave} />
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
