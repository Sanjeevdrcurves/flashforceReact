
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const usePhoneEntries = () => {
  const [phoneEntries, setPhoneEntries] = useState([
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

  const updatePhoneEntry = (id, field, value) => {
    setPhoneEntries(
      phoneEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removePhoneEntry = (id) => {
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
