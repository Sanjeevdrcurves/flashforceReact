
import React from "react";
import { ActivityType } from "@/types/activity";
import {
  DescriptionSection,
  VideoCallSection,
  TasksSection,
  TagsSection,
  CommentsSection,
} from "./sections";
import { ServiceAppointmentDetailsSection } from "./ServiceAppointmentDetailsSection";

interface DetailsTabProps {
  type: ActivityType;
  status: any;
  setStatus: (status: any) => void;
  priority: any;
  setPriority: (priority: any) => void;
  availability: any;
  setAvailability: (availability: any) => void;
  description: string;
  setDescription: (description: string) => void;
  videoCallPlatform: any;
  setVideoCallPlatform: (platform: any) => void;
  videoCallUrl: string;
  setVideoCallUrl: (url: string) => void;
  tasks: Array<{ id: string; title: string; completed: boolean }>;
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, field: string, value: any) => void;
  tags: any[];
  addTag: (name: string, color: string) => void;
  removeTag: (id: string) => void;
  comments: any[];
  addComment: (text: string) => void;
  removeComment: (id: string) => void;
  
  // Service appointment specific props
  patientBalance?: number;
  setPatientBalance?: (balance: number) => void;
  paperworkCompleted?: boolean;
  setPaperworkCompleted?: (completed: boolean) => void;
  assignedServices?: Array<{ id: string; name: string; price?: number }>;
  addAssignedService?: (service: { id: string; name: string; price?: number }) => void;
  removeAssignedService?: (id: string) => void;
  assignedProducts?: Array<{ id: string; name: string; quantity: number; price?: number }>;
  addAssignedProduct?: (product: { id: string; name: string; quantity: number; price?: number }) => void;
  removeAssignedProduct?: (id: string) => void;
  servicesOfInterest?: Array<{ id: string; name: string; notes?: string }>;
  addServiceOfInterest?: (service: { id: string; name: string; notes?: string }) => void;
  removeServiceOfInterest?: (id: string) => void;
  productsOfInterest?: Array<{ id: string; name: string; quantity: number; notes?: string }>;
  addProductOfInterest?: (product: { id: string; name: string; quantity: number; notes?: string }) => void;
  removeProductOfInterest?: (id: string) => void;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  type,
  description,
  setDescription,
  videoCallPlatform,
  setVideoCallPlatform,
  videoCallUrl,
  setVideoCallUrl,
  tasks,
  addTask,
  removeTask,
  updateTask,
  tags,
  addTag,
  removeTag,
  comments,
  addComment,
  removeComment,
  
  // Service appointment specific props
  patientBalance = 0,
  setPatientBalance = () => {},
  paperworkCompleted = false,
  setPaperworkCompleted = () => {},
  assignedServices = [],
  addAssignedService = () => {},
  removeAssignedService = () => {},
  assignedProducts = [],
  addAssignedProduct = () => {},
  removeAssignedProduct = () => {},
  servicesOfInterest = [],
  addServiceOfInterest = () => {},
  removeServiceOfInterest = () => {},
  productsOfInterest = [],
  addProductOfInterest = () => {},
  removeProductOfInterest = () => {},
}) => {
  // Determine which fields to show based on activity type
  const needsVideoCallOptions = ["meeting", "call"].includes(type);
  const isServiceAppointment = type === "service appointment";

  return (
    <div className="space-y-6">
      <DescriptionSection 
        description={description}
        setDescription={setDescription}
      />
      
      {/* Video Call Options (conditional) */}
      {needsVideoCallOptions && (
        <VideoCallSection
          videoCallPlatform={videoCallPlatform}
          setVideoCallPlatform={setVideoCallPlatform}
          videoCallUrl={videoCallUrl}
          setVideoCallUrl={setVideoCallUrl}
        />
      )}
      
      {/* Service Appointment Details (conditional) */}
      {isServiceAppointment && (
        <ServiceAppointmentDetailsSection
          patientBalance={patientBalance}
          setPatientBalance={setPatientBalance}
          paperworkCompleted={paperworkCompleted}
          setPaperworkCompleted={setPaperworkCompleted}
          assignedServices={assignedServices}
          addAssignedService={addAssignedService}
          removeAssignedService={removeAssignedService}
          assignedProducts={assignedProducts}
          addAssignedProduct={addAssignedProduct}
          removeAssignedProduct={removeAssignedProduct}
          servicesOfInterest={servicesOfInterest}
          addServiceOfInterest={addServiceOfInterest}
          removeServiceOfInterest={removeServiceOfInterest}
          productsOfInterest={productsOfInterest}
          addProductOfInterest={addProductOfInterest}
          removeProductOfInterest={removeProductOfInterest}
        />
      )}
      
      <TasksSection 
        tasks={tasks}
        addTask={addTask}
        removeTask={removeTask}
        updateTask={updateTask}
      />
      
      <TagsSection 
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
      />
      
      <CommentsSection 
        comments={comments}
        addComment={addComment}
        removeComment={removeComment}
      />
    </div>
  );
};
