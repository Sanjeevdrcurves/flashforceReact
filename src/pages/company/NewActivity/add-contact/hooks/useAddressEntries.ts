
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AddressEntry } from "../types";

export const useAddressEntries = () => {
  const [addressEntries, setAddressEntries] = useState<AddressEntry[]>([]);

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

  const updateAddressEntry = (id: string, field: keyof AddressEntry, value: string) => {
    setAddressEntries(
      addressEntries.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeAddressEntry = (id: string) => {
    setAddressEntries(addressEntries.filter(entry => entry.id !== id));
  };

  return {
    addressEntries,
    addAddressEntry,
    updateAddressEntry,
    removeAddressEntry
  };
};
