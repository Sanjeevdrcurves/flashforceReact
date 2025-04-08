
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useAddressEntries = () => {
  const [addressEntries, setAddressEntries] = useState([]);

  const addAddressEntry = () => {
    setAddressEntries([
      ...addressEntries, 
      { 
        street: "", 
        city: "", 
        state: "", 
        zipCode: "", 
        country: "", 
        id: `address-${uuidv4()}` 
      }
    ]);
  };

  const updateAddressEntry = (id, field, value) => {
    setAddressEntries(
      addressEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeAddressEntry = (id) => {
    setAddressEntries(addressEntries.filter(entry => entry.id !== id));
  };

  return {
    addressEntries,
    addAddressEntry,
    updateAddressEntry,
    removeAddressEntry
  };
};
