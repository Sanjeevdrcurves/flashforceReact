
import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface PhoneEntry {
  type: string;
  number: string;
  id: string;
}

export interface EmailEntry {
  type: string;
  email: string;
  id: string;
}

export interface SocialMediaEntry {
  platform: string;
  handle: string;
  id: string;
}

export interface AddressEntry {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  id: string;
}

export interface LabelEntry {
  name: string;
  id: string;
}

export interface ContactPerson {
  name: string;
  title: string;
  id: string;
}

export interface DndSettings {
  allChannels: boolean;
  email: boolean;
  text: boolean;
  phone: boolean;
  googleBusiness: boolean;
  facebook: boolean;
  inboundCallsAndSms: boolean;
}

export interface ContactTypeOption {
  id: string;
  label: string;
  icon: LucideIcon;
  category: "person" | "place";
}

export interface ContactData {
  type: string;
  category: "person" | "place";
  firstName: string;
  lastName: string;
  company: string;
  location: string;
  birthday: string;
  description: string;
  timezone: string;
  visibility: string;
  phoneEntries: PhoneEntry[];
  emailEntries: EmailEntry[];
  socialMediaEntries: SocialMediaEntry[];
  addressEntries: AddressEntry[];
  labels: LabelEntry[];
  urls: string[];
  notes: string;
  photoUrl: string;
  dndSettings: DndSettings;
  contactPersons?: ContactPerson[];
}
