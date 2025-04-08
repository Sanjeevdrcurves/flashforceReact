
import { useCallback } from "react";
import {
  useBasicFields,
  usePhoneEntries,
  useEmailEntries,
  useAddressEntries,
  useSocialMediaEntries,
  useUrlEntries,
  useLabelEntries,
  useContactPersons,
  useDndSettings
} from "./hooks";

export const useContactForm = () => {
  // Basic fields
  const basicFields = useBasicFields();
  
  // Phone entries
  const phoneEntries = usePhoneEntries();
  
  // Email entries
  const emailEntries = useEmailEntries();
  
  // Address entries
  const addressEntries = useAddressEntries();
  
  // Social media entries
  const socialMediaEntries = useSocialMediaEntries();
  
  // URL entries
  const urlEntries = useUrlEntries();
  
  // Label entries
  const labelEntries = useLabelEntries();
  
  // Contact persons
  const contactPersons = useContactPersons();
  
  // DND settings
  const dndSettings = useDndSettings();

  // Reset form
  const resetForm = useCallback(() => {
    // Reset basic fields
    basicFields.setSelectedCategory("person");
    basicFields.setSelectedType("person");
    basicFields.setFirstName("");
    basicFields.setLastName("");
    basicFields.setCompany("");
    basicFields.setLocation("");
    basicFields.setBirthday("");
    basicFields.setDescription("");
    basicFields.setTimezone("");
    basicFields.setVisibility("all");
    basicFields.setPhotoUrl("");
    basicFields.setNotes("");
    
    // Reset phone entries
    const defaultPhone = { type: "mobile", number: "", id: "phone-0" };
    phoneEntries.phoneEntries.forEach(entry => {
      if (entry.id !== "phone-0") {
        phoneEntries.removePhoneEntry(entry.id);
      }
    });
    phoneEntries.updatePhoneEntry("phone-0", "type", defaultPhone.type);
    phoneEntries.updatePhoneEntry("phone-0", "number", defaultPhone.number);
    
    // Reset email entries
    const defaultEmail = { type: "work", email: "", id: "email-0" };
    emailEntries.emailEntries.forEach(entry => {
      if (entry.id !== "email-0") {
        emailEntries.removeEmailEntry(entry.id);
      }
    });
    emailEntries.updateEmailEntry("email-0", "type", defaultEmail.type);
    emailEntries.updateEmailEntry("email-0", "email", defaultEmail.email);
    
    // Reset other entries
    addressEntries.addressEntries.forEach(entry => {
      addressEntries.removeAddressEntry(entry.id);
    });
    
    socialMediaEntries.socialMediaEntries.forEach(entry => {
      socialMediaEntries.removeSocialMediaEntry(entry.id);
    });
    
    urlEntries.urls.forEach((_, index) => {
      urlEntries.removeUrlEntry(urlEntries.urls.length - 1 - index);
    });
    
    labelEntries.labels.forEach(label => {
      labelEntries.removeLabel(label.id);
    });
    
    contactPersons.contactPersons.forEach(person => {
      contactPersons.removeContactPerson(person.id);
    });
    
    // Reset DND settings
    dndSettings.updateDndSettings({
      allChannels: false,
      email: false,
      text: false,
      phone: false,
      googleBusiness: false,
      facebook: false,
      inboundCallsAndSms: false
    });
  }, [
    basicFields, 
    phoneEntries, 
    emailEntries, 
    addressEntries, 
    socialMediaEntries, 
    urlEntries, 
    labelEntries, 
    contactPersons, 
    dndSettings
  ]);

  return {
    formState: {
      ...basicFields,
      ...phoneEntries,
      ...emailEntries,
      ...addressEntries,
      ...socialMediaEntries,
      ...urlEntries,
      ...labelEntries,
      ...contactPersons,
      ...dndSettings
    },
    handlers: {
      ...basicFields,
      ...phoneEntries,
      ...emailEntries,
      ...addressEntries,
      ...socialMediaEntries,
      ...urlEntries,
      ...labelEntries,
      ...contactPersons,
      ...dndSettings
    },
    resetForm
  };
};
