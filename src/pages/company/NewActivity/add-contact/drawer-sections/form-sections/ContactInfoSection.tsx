
import React from "react";
import CategoryTypeSelector from "../../CategoryTypeSelector";
import ContactTypeFields from "../../ContactTypeFields";
import PhotoUploader from "../../PhotoUploader";

interface ContactInfoSectionProps {
  selectedCategory: "person" | "place";
  selectedType: string;
  firstName: string;
  lastName: string;
  company: string;
  birthday: string;
  photoUrl: string;
  contactPersons: any[];
  setSelectedCategory: (category: "person" | "place") => void;
  setSelectedType: (type: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setCompany: (value: string) => void;
  setBirthday: (value: string) => void;
  setPhotoUrl: (value: string) => void;
  addContactPerson: () => void;
  updateContactPerson: (id: string, field: string, value: string) => void;
  removeContactPerson: (id: string) => void;
  isAdmin?: boolean;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  selectedCategory,
  selectedType,
  firstName,
  lastName,
  company,
  birthday,
  photoUrl,
  contactPersons,
  setSelectedCategory,
  setSelectedType,
  setFirstName,
  setLastName,
  setCompany,
  setBirthday,
  setPhotoUrl,
  addContactPerson,
  updateContactPerson,
  removeContactPerson,
  isAdmin = false,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-2 border-b">Contact Information</h3>
      
      <CategoryTypeSelector 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        isAdmin={isAdmin}
      />
      
      <ContactTypeFields 
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        company={company}
        setCompany={setCompany}
        birthday={birthday}
        setBirthday={setBirthday}
        contactPersons={contactPersons}
        updateContactPerson={updateContactPerson}
        addContactPerson={addContactPerson}
        removeContactPerson={removeContactPerson}
      />
      
      <PhotoUploader 
        photoUrl={photoUrl}
        setPhotoUrl={setPhotoUrl}
      />
    </div>
  );
};

export default ContactInfoSection;
