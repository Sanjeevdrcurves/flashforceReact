
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useContactPersons = () => {
  const [contactPersons, setContactPersons] = useState([]);

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { name: "", title: "", id: `person-${uuidv4()}` }
    ]);
  };

  const updateContactPerson = (id, field, value) => {
    setContactPersons(
      contactPersons.map(person => 
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  const removeContactPerson = (id) => {
    setContactPersons(contactPersons.filter(person => person.id !== id));
  };

  return {
    contactPersons,
    addContactPerson,
    updateContactPerson,
    removeContactPerson
  };
};
