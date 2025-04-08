
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PhoneEntry } from "../types";

export const usePhoneEntries = () => {
  const [phoneEntries, setPhoneEntries] = useState<PhoneEntry[]>([
    { type: "mobile", number: "", id: "phone-0" }
  ]);

  const addPhoneEntry = () => {
    setPhoneEntries([
      ...phoneEntries, 
      { 
        type: "mobile", 
        number: "", 
        id: `phone-${uuidv4()}` 
      }
    ]);
  };

  const updatePhoneEntry = (id: string, field: keyof PhoneEntry, value: string) => {
    setPhoneEntries(
      phoneEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removePhoneEntry = (id: string) => {
    if (phoneEntries.length > 1) {
      setPhoneEntries(phoneEntries.filter(entry => entry.id !== id));
    }
  };

  return {
    phoneEntries,
    addPhoneEntry,
    updatePhoneEntry,
    removePhoneEntry
  };
};
