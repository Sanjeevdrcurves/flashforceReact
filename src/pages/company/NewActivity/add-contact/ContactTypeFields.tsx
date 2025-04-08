
import React from "react";
import { PersonFields } from "./contact-type-fields";
import { PlaceFields } from "./contact-type-fields";
import { ContactPerson } from "./types";

interface ContactTypeFieldsProps {
  selectedCategory: "person" | "place";
  selectedType: string;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  birthday: string;
  setBirthday: (value: string) => void;
  contactPersons: ContactPerson[];
  updateContactPerson: (id: string, field: keyof ContactPerson, value: string) => void;
  addContactPerson: () => void;
  removeContactPerson: (id: string) => void;
}

const ContactTypeFields: React.FC<ContactTypeFieldsProps> = ({
  selectedCategory,
  selectedType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  company,
  setCompany,
  birthday,
  setBirthday,
  contactPersons,
  updateContactPerson,
  addContactPerson,
  removeContactPerson,
}) => {
  // Render person-specific fields
  if (selectedCategory === "person") {
    return (
      <PersonFields 
        selectedType={selectedType}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        company={company}
        setCompany={setCompany}
        birthday={birthday}
        setBirthday={setBirthday}
      />
    );
  } 
  // Render place-specific fields
  else if (selectedCategory === "place") {
    return (
      <PlaceFields 
        selectedType={selectedType}
        company={company}
        setCompany={setCompany}
        contactPersons={contactPersons}
        updateContactPerson={updateContactPerson}
        addContactPerson={addContactPerson}
        removeContactPerson={removeContactPerson}
      />
    );
  }

  return null;
};

export default ContactTypeFields;
