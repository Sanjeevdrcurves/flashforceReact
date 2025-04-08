
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useEmailEntries = () => {
  const [emailEntries, setEmailEntries] = useState([
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

  const updateEmailEntry = (id, field, value) => {
    setEmailEntries(
      emailEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeEmailEntry = (id) => {
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
