
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EmailEntry } from "../types";

export const useEmailEntries = () => {
  const [emailEntries, setEmailEntries] = useState<EmailEntry[]>([
    { type: "work", email: "", id: "email-0" }
  ]);

  const addEmailEntry = () => {
    setEmailEntries([
      ...emailEntries, 
      { 
        type: "work", 
        email: "", 
        id: `email-${uuidv4()}` 
      }
    ]);
  };

  const updateEmailEntry = (id: string, field: keyof EmailEntry, value: string) => {
    setEmailEntries(
      emailEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeEmailEntry = (id: string) => {
    if (emailEntries.length > 1) {
      setEmailEntries(emailEntries.filter(entry => entry.id !== id));
    }
  };

  return {
    emailEntries,
    addEmailEntry,
    updateEmailEntry,
    removeEmailEntry
  };
};
