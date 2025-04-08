import { User, TrendingUp, Briefcase, Building, Store, Truck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ContactTypeOption } from "./types";

// Person contact types
export const personContactTypeOptions: ContactTypeOption[] = [
  { id: "person", label: "Person", icon: User, category: "person" },
  { id: "lead", label: "Lead", icon: TrendingUp, category: "person" },
  { id: "prospect", label: "Prospect", icon: Users, category: "person" },
  { id: "deal", label: "Deal", icon: Briefcase, category: "person" },
];

// Place contact types
export const placeContactTypeOptions: ContactTypeOption[] = [
  { id: "company", label: "Company", icon: Building, category: "place" },
  { id: "account", label: "Account", icon: Store, category: "place" },
  { id: "vendor", label: "Vendor", icon: Truck, category: "place" },
];

// Combined for backward compatibility
export const contactTypeOptions: ContactTypeOption[] = [
  ...personContactTypeOptions,
  ...placeContactTypeOptions
];

// Phone type options
export const phoneTypes = [
  { value: "mobile", label: "Mobile" },
  { value: "work", label: "Work" },
  { value: "home", label: "Home" },
  { value: "other", label: "Other" },
];

// Email type options
export const emailTypes = [
  { value: "work", label: "Work" },
  { value: "home", label: "Home" },
  { value: "other", label: "Other" },
];

// Visibility options
export const visibilityOptions = [
  { value: "all", label: "All Users" },
  { value: "teams", label: "Teams" },
  { value: "owner", label: "Owner" },
  { value: "followers", label: "Followers" },
];

// Time zone options (simplified for example)
export const timezoneOptions = [
  { value: "et", label: "Eastern Time (ET)" },
  { value: "ct", label: "Central Time (CT)" },
  { value: "mt", label: "Mountain Time (MT)" },
  { value: "pt", label: "Pacific Time (PT)" },
  { value: "gmt", label: "Greenwich Mean Time (GMT)" },
  { value: "utc", label: "Coordinated Universal Time (UTC)" },
];

// Social media options
export const socialMediaOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "zoom", label: "Zoom" },
  { value: "skype", label: "Skype" },
  { value: "github", label: "GitHub" },
  { value: "tiktok", label: "TikTok" },
  { value: "snapchat", label: "Snapchat" },
  { value: "pinterest", label: "Pinterest" },
  { value: "telegram", label: "Telegram" },
  { value: "threads", label: "Threads" },
  { value: "x", label: "X" },
  { value: "messenger", label: "Messenger" },
];
