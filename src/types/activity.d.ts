
export type ActivityType = 
  | "call" 
  | "meeting" 
  | "task" 
  | "deadline" 
  | "email" 
  | "note" 
  | "service appointment";

export type ActivityPriority = "low" | "medium" | "high";

export type ActivityStatus = 
  | "scheduled" 
  | "in progress" 
  | "completed" 
  | "canceled" 
  | "rescheduled";

export type ActivityAvailability = "free" | "busy" | "tentative" | "out of office";

export type VideoCallPlatform = 
  | "zoom" 
  | "teams" 
  | "google meet" 
  | "webex" 
  | "skype" 
  | "none";

export type RecurrencePattern = 
  | "daily" 
  | "weekly" 
  | "monthly" 
  | "yearly" 
  | "custom";

export interface Reminder {
  id: string;
  time: number; // Minutes before the activity
  type: "email" | "notification" | "sms";
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

export interface ActivityTag {
  id: string;
  name: string;
  color: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  startDate?: Date;
  dueDate: Date;
  startTime?: string;
  dueTime?: string;
  priority: ActivityPriority;
  description?: string;
  owner?: string;
  availability: ActivityAvailability;
  status: ActivityStatus;
  videoCallPlatform?: VideoCallPlatform;
  videoCallUrl?: string;
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
  assignedServices?: Array<{ id: string; name: string; price?: number }>;
  assignedProducts?: Array<{ id: string; name: string; quantity: number; price?: number }>;
  servicesOfInterest?: Array<{ id: string; name: string; notes?: string }>;
  productsOfInterest?: Array<{ id: string; name: string; quantity: number; notes?: string }>;
}
