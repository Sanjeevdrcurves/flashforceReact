
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContactPerson } from "../types";

export const useContactPersons = () => {
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { name: "", title: "", id: `person-${uuidv4()}` }
    ]);
  };

  const updateContactPerson = (id: string, field: keyof ContactPerson, value: string) => {
    setContactPersons(
      contactPersons.map(person => 
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  const removeContactPerson = (id: string) => {
    setContactPersons(contactPersons.filter(person => person.id !== id));
  };

  return {
    contactPersons,
    addContactPerson,
    updateContactPerson,
    removeContactPerson
  };
};
