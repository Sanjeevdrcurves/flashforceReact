import React, { useState } from 'react';
// Import your existing TemplateSelector component
import TemplateSelector from './TemplateSelector';

// Example mock function for creating a new tag
const createNewTag = async (newTagName) => {
  // For demonstration, return a mock object:
  return { id: Date.now(), name: newTagName };
};

const AddTemplate = () => {
  // Example state for demonstration
  const [field, setField] = useState({ value: 'exampleId', categories: [] });
  const [customTags, setCustomTags] = useState([]);
  const [companyId, setCompanyId] = useState();

  // NEW state to store the selected template’s description
  const [selectedDescription, setSelectedDescription] = useState('');

  // Called when an existing tag is selected
  const handleTagSelect = (selectedTag) => {
    console.log('Template selected:', selectedTag);
    // If your templates have a `.description` property, store it:
    if (selectedTag?.description) {
      setSelectedDescription(selectedTag.description);
    } else {
      // If the selected template doesn't have a description,
      // clear or handle differently as you see fit
      setSelectedDescription('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-12 gap-4 items-center mb-4">
        {/* 'col-span-4' => 4/12 = 33.3% width */}
        <div className="col-span-4">
          <label
            htmlFor="templateSelector"
            className="block text-sm font-medium text-gray-700"
          >
            Select or Create a Template
          </label>
        </div>

        {/* 'col-span-8' => 8/12 = 66.7% width */}
        <div className="col-span-8">
          <TemplateSelector
            id={field.value}
            companyId={companyId}
            tags={customTags}
            categories={field.categories}
            onTagSelect={handleTagSelect}
            onAddTemplate={async (newTagName) => {
              const createdTemplate = await createNewTag(newTagName);
              // Update local state if you want to keep track of newly created tags
              setCustomTags((prev) => [...prev, createdTemplate]);
              return createdTemplate;
            }}
            placeholder="Search or create a new template..."
            // NEW: if dropdown has zero results, clear the description
            onNoResults={() => setSelectedDescription('')}  
          />
        </div>
      </div>

      {/* NEW: Textarea for showing the selected template’s description */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <label
            htmlFor="templateDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Template Description
          </label>
        </div>
        <div className="col-span-8">
          <textarea
            id="templateDescription"
            className="w-full p-2 border rounded-md resize-none"
            rows={4}
            value={selectedDescription}
            onChange={(e) => setSelectedDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTemplate;
