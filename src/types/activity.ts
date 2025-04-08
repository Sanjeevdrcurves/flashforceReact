import { Contact } from "./contact";

export type ActivityType = 
  | "call"
  | "meeting"
  | "task"
  | "deadline"
  | "visit"
  | "email"
  | "lunch"
  | "service appointment"
  | "custom";

export type ActivityPriority = "high" | "medium" | "low";

export type ActivityStatus = "scheduled" | "completed" | "canceled" | "in-progress" | "log";

export type ActivityAvailability = "busy" | "free" | "tentative" | "out-of-office";

export type VideoCallPlatform = 
  | "zoom"
  | "doxy"
  | "google"
  | "teams"
  | "custom"
  | "none";

export type RecurrencePattern = 
  | "daily" 
  | "weekly" 
  | "bi-weekly" 
  | "monthly" 
  | "yearly" 
  | "custom";

export type Reminder = {
  id: string;
  time: number; // minutes before activity
  type: "email" | "notification" | "sms";
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
};

export type ActivityTag = {
  id: string;
  name: string;
  color: string;
};

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  startDate?: Date;
  dueDate: Date;
  startTime?: string;
  dueTime?: string;
  priority?: ActivityPriority;
  description?: string;
  owner?: string;
  availability?: ActivityAvailability;
  status: ActivityStatus;
  videoCallPlatform?: VideoCallPlatform;
  videoCallUrl?: string;
  contacts?: Contact[];
  customFields?: Record<string, any>;
  associatedDeals?: string[];
  associatedProjects?: string[];
  associatedOrganizations?: string[];
  associatedUsers?: string[];
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  recurrenceDays?: number[];
  comments?: Comment[];
  reminders?: Reminder[];
  tags?: ActivityTag[];
  tasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  participants?: Array<{
    name: string;
    email: string;
    external: boolean;
  }>;
  
  clientDetails?: {
    patientBalance?: number;
    paperworkCompleted?: boolean;
  };
  
  assignedServices?: Array<{
    id: string;
    name: string;
    price?: number;
  }>;
  
  assignedProducts?: Array<{
    id: string;
    name: string;
    quantity: number;
    price?: number;
  }>;
  
  servicesOfInterest?: Array<{
    id: string;
    name: string;
    notes?: string;
  }>;
  
  productsOfInterest?: Array<{
    id: string;
    name: string;
    notes?: string;
  }>;
}
