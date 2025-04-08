
import React from "react";
import { ActivityTypeSelector } from "../../ActivityTypeSelector";
import { TemplateSelector } from "./TemplateSelector";

const ActivityHeader = ({
  type,
  setType,
  template,
  setTemplate,
  onTemplateSelect,
}) => {
  return (
    <div className="flex space-x-3">
      <div className="flex-1">
        <ActivityTypeSelector
          value={type}
          onChange={setType}
          buttonClassName="w-full"
        />
      </div>
      <div className="flex-1">
        <TemplateSelector 
          type={type}
          value={template}
          onChange={(templateId) => {
            setTemplate(templateId);
            onTemplateSelect(templateId);
          }}
        />
      </div>
    </div>
  );
};

export { ActivityHeader };
