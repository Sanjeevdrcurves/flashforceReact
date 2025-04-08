
import React from "react";
import { ContactData } from "../types";
import {
  ContactInfoSection,
  CommunicationSection,
  LocationSection,
  MetadataSection,
  NotesSection
} from "./form-sections";

interface DrawerFormProps {
  formState: {
    selectedCategory: "person" | "place";
    selectedType: string;
    firstName: string;
    lastName: string;
    company: string;
    birthday: string;
    description: string;
    timezone: string;
    visibility: string;
    phoneEntries: any[];
    emailEntries: any[];
    socialMediaEntries: any[];
    addressEntries: any[];
    labels: any[];
    urls: string[];
    photoUrl: string;
    dndSettings: any;
    contactPersons: any[];
    notes: string;
  };
  handlers: {
    setSelectedCategory: (category: "person" | "place") => void;
    setSelectedType: (type: string) => void;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setCompany: (value: string) => void;
    setBirthday: (value: string) => void;
    setDescription: (value: string) => void;
    setTimezone: (value: string) => void;
    setVisibility: (value: string) => void;
    setPhotoUrl: (value: string) => void;
    setNotes: (value: string) => void;
    updatePhoneEntry: (id: string, field: string, value: string) => void;
    addPhoneEntry: () => void;
    removePhoneEntry: (id: string) => void;
    updateEmailEntry: (id: string, field: string, value: string) => void;
    addEmailEntry: () => void;
    removeEmailEntry: (id: string) => void;
    updateAddressEntry: (id: string, field: string, value: string) => void;
    addAddressEntry: () => void;
    removeAddressEntry: (id: string) => void;
    updateSocialMediaEntry: (id: string, field: string, value: string) => void;
    addSocialMediaEntry: () => void;
    removeSocialMediaEntry: (id: string) => void;
    updateUrlEntry: (index: number, value: string) => void;
    addUrlEntry: () => void;
    removeUrlEntry: (index: number) => void;
    updateLabel: (id: string, name: string) => void;
    addLabel: () => void;
    removeLabel: (id: string) => void;
    updateDndSettings: (settings: any) => void;
    addContactPerson: () => void;
    updateContactPerson: (id: string, field: string, value: string) => void;
    removeContactPerson: (id: string) => void;
  };
  isAdmin?: boolean;
}

const DrawerForm: React.FC<DrawerFormProps> = ({
  formState,
  handlers,
  isAdmin = false,
}) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Contact Information Section */}
      <ContactInfoSection
        selectedCategory={formState.selectedCategory}
        selectedType={formState.selectedType}
        firstName={formState.firstName}
        lastName={formState.lastName}
        company={formState.company}
        birthday={formState.birthday}
        photoUrl={formState.photoUrl}
        contactPersons={formState.contactPersons}
        setSelectedCategory={handlers.setSelectedCategory}
        setSelectedType={handlers.setSelectedType}
        setFirstName={handlers.setFirstName}
        setLastName={handlers.setLastName}
        setCompany={handlers.setCompany}
        setBirthday={handlers.setBirthday}
        setPhotoUrl={handlers.setPhotoUrl}
        addContactPerson={handlers.addContactPerson}
        updateContactPerson={handlers.updateContactPerson}
        removeContactPerson={handlers.removeContactPerson}
        isAdmin={isAdmin}
      />
      
      {/* Communication Details Section */}
      <CommunicationSection
        phoneEntries={formState.phoneEntries}
        emailEntries={formState.emailEntries}
        socialMediaEntries={formState.socialMediaEntries}
        urls={formState.urls}
        updatePhoneEntry={handlers.updatePhoneEntry}
        addPhoneEntry={handlers.addPhoneEntry}
        removePhoneEntry={handlers.removePhoneEntry}
        updateEmailEntry={handlers.updateEmailEntry}
        addEmailEntry={handlers.addEmailEntry}
        removeEmailEntry={handlers.removeEmailEntry}
        updateSocialMediaEntry={handlers.updateSocialMediaEntry}
        addSocialMediaEntry={handlers.addSocialMediaEntry}
        removeSocialMediaEntry={handlers.removeSocialMediaEntry}
        updateUrlEntry={handlers.updateUrlEntry}
        addUrlEntry={handlers.addUrlEntry}
        removeUrlEntry={handlers.removeUrlEntry}
      />
      
      {/* Location Information Section */}
      <LocationSection
        addressEntries={formState.addressEntries}
        timezone={formState.timezone}
        updateAddressEntry={handlers.updateAddressEntry}
        addAddressEntry={handlers.addAddressEntry}
        removeAddressEntry={handlers.removeAddressEntry}
        setTimezone={handlers.setTimezone}
      />
      
      {/* Notes Section */}
      <NotesSection
        notes={formState.notes}
        setNotes={handlers.setNotes}
      />
      
      {/* Additional Information/Metadata Section */}
      <MetadataSection
        description={formState.description}
        visibility={formState.visibility}
        labels={formState.labels}
        dndSettings={formState.dndSettings}
        setDescription={handlers.setDescription}
        setVisibility={handlers.setVisibility}
        updateLabel={handlers.updateLabel}
        addLabel={handlers.addLabel}
        removeLabel={handlers.removeLabel}
        updateDndSettings={handlers.updateDndSettings}
      />
    </div>
  );
};

export default DrawerForm;
