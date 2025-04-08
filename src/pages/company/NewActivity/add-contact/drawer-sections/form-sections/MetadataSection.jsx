
import React from "react";
import LabelEntries from "../../LabelEntries";
import VisibilitySelector from "../../VisibilitySelector";
import DescriptionField from "../../DescriptionField";
import DoNotDisturbSettings from "../../DoNotDisturbSettings";
import ImportButton from "../../ImportButton";

const MetadataSection = ({
  description,
  visibility,
  labels,
  dndSettings,
  setDescription,
  setVisibility,
  updateLabel,
  addLabel,
  removeLabel,
  updateDndSettings,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-2 border-b">Additional Information</h3>
      
      <DescriptionField 
        description={description}
        setDescription={setDescription}
      />
      
      <LabelEntries 
        labels={labels}
        updateLabel={updateLabel}
        addLabel={addLabel}
        removeLabel={removeLabel}
      />
      
      <VisibilitySelector 
        visibility={visibility}
        setVisibility={setVisibility}
      />
      
      <DoNotDisturbSettings 
        dndSettings={dndSettings}
        updateDndSettings={updateDndSettings}
      />
      
      <ImportButton />
    </div>
  );
};

export default MetadataSection;
