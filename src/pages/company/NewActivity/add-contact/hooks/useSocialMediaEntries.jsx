
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useSocialMediaEntries = () => {
  const [socialMediaEntries, setSocialMediaEntries] = useState([]);

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

  const updateSocialMediaEntry = (id, field, value) => {
    setSocialMediaEntries(
      socialMediaEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeSocialMediaEntry = (id) => {
    setSocialMediaEntries(socialMediaEntries.filter(entry => entry.id !== id));
  };

  return {
    socialMediaEntries,
    addSocialMediaEntry,
    updateSocialMediaEntry,
    removeSocialMediaEntry
  };
};
