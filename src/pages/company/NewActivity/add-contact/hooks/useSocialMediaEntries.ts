
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SocialMediaEntry } from "../types";

export const useSocialMediaEntries = () => {
  const [socialMediaEntries, setSocialMediaEntries] = useState<SocialMediaEntry[]>([]);

  const addSocialMediaEntry = () => {
    setSocialMediaEntries([
      ...socialMediaEntries, 
      { 
        platform: "facebook", 
        handle: "", 
        id: `social-${uuidv4()}` 
      }
    ]);
  };

  const updateSocialMediaEntry = (id: string, field: keyof SocialMediaEntry, value: string) => {
    setSocialMediaEntries(
      socialMediaEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeSocialMediaEntry = (id: string) => {
    setSocialMediaEntries(socialMediaEntries.filter(entry => entry.id !== id));
  };

  return {
    socialMediaEntries,
    addSocialMediaEntry,
    updateSocialMediaEntry,
    removeSocialMediaEntry
  };
};
