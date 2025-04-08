
import React from "react";
import PhoneEntries from "../../PhoneEntries";
import EmailEntries from "../../EmailEntries";
import SocialMediaEntries from "../../SocialMediaEntries";
import UrlEntries from "../../UrlEntries";

interface CommunicationSectionProps {
  phoneEntries: any[];
  emailEntries: any[];
  socialMediaEntries: any[];
  urls: string[];
  updatePhoneEntry: (id: string, field: string, value: string) => void;
  addPhoneEntry: () => void;
  removePhoneEntry: (id: string) => void;
  updateEmailEntry: (id: string, field: string, value: string) => void;
  addEmailEntry: () => void;
  removeEmailEntry: (id: string) => void;
  updateSocialMediaEntry: (id: string, field: string, value: string) => void;
  addSocialMediaEntry: () => void;
  removeSocialMediaEntry: (id: string) => void;
  updateUrlEntry: (index: number, value: string) => void;
  addUrlEntry: () => void;
  removeUrlEntry: (index: number) => void;
}

const CommunicationSection: React.FC<CommunicationSectionProps> = ({
  phoneEntries,
  emailEntries,
  socialMediaEntries,
  urls,
  updatePhoneEntry,
  addPhoneEntry,
  removePhoneEntry,
  updateEmailEntry,
  addEmailEntry,
  removeEmailEntry,
  updateSocialMediaEntry,
  addSocialMediaEntry,
  removeSocialMediaEntry,
  updateUrlEntry,
  addUrlEntry,
  removeUrlEntry,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-2 border-b">Communication Details</h3>
      
      <PhoneEntries 
        phoneEntries={phoneEntries}
        updatePhoneEntry={updatePhoneEntry}
        addPhoneEntry={addPhoneEntry}
        removePhoneEntry={removePhoneEntry}
      />
      
      <EmailEntries 
        emailEntries={emailEntries}
        updateEmailEntry={updateEmailEntry}
        addEmailEntry={addEmailEntry}
        removeEmailEntry={removeEmailEntry}
      />
      
      <SocialMediaEntries 
        socialMediaEntries={socialMediaEntries}
        updateSocialMediaEntry={updateSocialMediaEntry}
        addSocialMediaEntry={addSocialMediaEntry}
        removeSocialMediaEntry={removeSocialMediaEntry}
      />
      
      <UrlEntries 
        urls={urls}
        updateUrlEntry={updateUrlEntry}
        addUrlEntry={addUrlEntry}
        removeUrlEntry={removeUrlEntry}
      />
    </div>
  );
};

export default CommunicationSection;
