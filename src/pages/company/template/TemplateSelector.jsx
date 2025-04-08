import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Plus, Loader2, Tags, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env?.VITE_FLASHFORCE_API_URL || 'https://example.com';

export default function TemplateSelector({
  tags = [],         // fallback array of tags
  categories = [],   // optional array of categories
  onTagSelect,       // callback when a tag is selected
  onAddTemplate,          // callback for creating a new tag
  onNoResults,       // optional callback when filteredTags is empty
  id,                // used for fetching tags (e.g., tag category id)
  CompanyId,         // (not used directly in your code, but kept for reference)
  placeholder = "Apply new or existing template...",
}) {
  const [query, setQuery] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  // For creating a new Template
  const [newTemplateName, setNewTemplateName] = useState(query.trim() || '');
  const [newTagCategory, setNewTagCategory] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateError, setNewTemplateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- NEW STATES for Object / Object Type dropdowns ----
  const [objectsData, setObjectsData] = useState([]);            // Fetched objects
  const [selectedObjectId, setSelectedObjectId] = useState('');   // Single selection
  const [objectTypesData, setObjectTypesData] = useState([]);     // Fetched object types
  const [selectedObjectTypeId, setSelectedObjectTypeId] = useState('');

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
 
  const objectId=22;
  const objectTypeId=132;
  // -------------------------
  // 1. Fetch custom templates
  // -------------------------
  useEffect(() => {
    const fetchCustomTags = async () => {
      try {
        const resp = await axios.get(
          `${API_URL}/Template/GetTemplateByCompanyId/${companyId}/${objectId}/${objectTypeId}`
        );
        const loaded = (resp.data || []).map((t) => ({
          value: t.templateID,
          label: t.templateName,
          description: t.description,
          companyId: t.companyId,
        }));
        setCustomTemplates(loaded);
      } catch (err) {
        console.error('Error fetching Templates:', err);
      }
    };

    if (id && companyId) {
      fetchCustomTags();
    }
  }, [id, companyId]);

  // Merge fetched tags with fallback
  const allTags = customTemplates.length ? customTemplates : tags;

  // -------------------------
  // 2. Fetch objects for first dropdown in modal
  // -------------------------
  useEffect(() => {
    // Only fetch once when modal opens (or on mount) if you want
    // them pre-fetched. If you only want to fetch upon opening the modal,
    // place this logic inside "if (isModalOpen) {...}"
    const fetchObjects = async () => {
      try {
        const resp = await axios.get(`${API_URL}/CustomObject/GetObjects/0`);
        setObjectsData(resp.data || []);
      } catch (err) {
        console.error('Error fetching objects:', err);
      }
    };

    fetchObjects();
  }, []);

  // -------------------------
  // 3. Fetch object types for second dropdown (depends on selectedObjectId)
  // -------------------------
  useEffect(() => {
    const fetchObjectTypes = async () => {
      if (!selectedObjectId) {
        setObjectTypesData([]);
        return;
      }
      try {
        const resp = await axios.get(
          `${API_URL}/CustomObject/GetObjectTypes?objectTypeId=0&objectId=${selectedObjectId}`
        );
        setObjectTypesData(resp.data || []);
      } catch (err) {
        console.error('Error fetching object types:', err);
      }
    };

    fetchObjectTypes();
  }, [selectedObjectId]);

  // Exclude already-selected tags
  const unselectedTags = allTags.filter(
    (t) => !selectedTemplates.some((s) => s.value === t.value)
  );

  // Filter tags by search query
  const filteredTags = query
    ? unselectedTags.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
      )
    : unselectedTags;

  // NEW: If filteredTags is empty, invoke onNoResults (if provided)
  useEffect(() => {
    if (filteredTags.length === 0 && onNoResults) {
      onNoResults();
    }
  }, [filteredTags, onNoResults]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (ev) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Reset new template inputs when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setNewTemplateName(query.trim() || '');
      setNewTagCategory('');
      setNewTemplateDescription('');
      setNewTemplateError('');
      setSelectedObjectId('');
      setObjectTypesData([]);
      setSelectedObjectTypeId('');
    }
  }, [isModalOpen, query]);

  // -------------------------
  // CREATE NEW TEMPLATE
  // -------------------------
  const handleAddTemplate = async () => {
    if (!newTemplateName.trim()) {
      setNewTemplateError("Template name is required");
      return;
    }
   if(!newTemplateDescription.trim()) {
    setNewTemplateError("Template description is required");
    return;
  }
   if (!selectedObjectId) {
      setNewTemplateError("Object is required");
      return;
    }
    if (!selectedObjectTypeId) {
      setNewTemplateError("Object Type is required");
      return;
    }
    setNewTemplateError("");
    if (!onAddTemplate) return;

    setIsSubmitting(true);
    try {
      // Build payload with objectId and objectTypeId as well
      const payload = {
        templateName: newTemplateName,
        description: newTemplateDescription,
        isActive: true,
        createBy: String(userId),
        companyId: companyId,

        // Add new fields from your dropdown selections:
        objectId: selectedObjectId ? Number(selectedObjectId) : null,
        objectTypeId: selectedObjectTypeId ? Number(selectedObjectTypeId) : null
      };

      const apiUrl = `${API_URL}/Template/InsertTemplate`;
      const response = await axios.post(apiUrl, payload);

      console.log('Response:', response.data);
      if (response) {
        // After successful creation
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setIsSubmitting(false);
        setNewTemplateName('');
        setNewTemplateDescription('');
        setQuery('');
      }

      // If you want to refresh custom templates
      // after the new template is created:
      // (We do it in the same function you had before)
      const fetchCustomTags = async () => {
        try {
          const resp = await axios.get(
            `${API_URL}/Template/GetTemplateByCompanyId/${companyId}/${objectId}/${objectTypeId}`
          );
          const loaded = (resp.data || []).map((t) => ({
            value: t.templateID,
            label: t.templateName,
            description: t.description,
            companyId: t.companyId,
          }));
          setCustomTemplates(loaded);
        } catch (err) {
          console.error('Error fetching templates:', err);
        }
      };
      fetchCustomTags();
    } catch (error) {
      console.error('Error sending template:', error);
    }
  };

  // -------------------------
  // SELECT AN EXISTING TAG
  // -------------------------
  const handleSelectTag = (tag) => {
    setSelectedTemplates((prev) => [...prev, tag]);
    onTagSelect?.(tag);
    setQuery('');
    setIsDropdownOpen(false);
  };

  // Remove a selected tag
  const handleRemoveTag = (tag) => {
    setSelectedTemplates((prev) => prev.filter((x) => x.value !== tag.value));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* MAIN INPUT + SELECTED TAGS */}
      <div
        className="flex flex-wrap items-center gap-2 w-full 
                   rounded-md border border-input bg-background 
                   p-1 focus-within:ring-1 focus-within:ring-ring"
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(true);
        }}
      >
        {selectedTemplates.map((tag) => (
          <div
            key={tag.value}
            className="flex items-center rounded px-2 py-1 text-sm 
                       bg-primary/10 border border-primary/20"
          >
            <span>{tag.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(tag);
              }}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <Input
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          className="flex-1 border-0 focus-visible:ring-0 
                     focus-visible:ring-offset-0 p-0"
          onFocus={() => setIsDropdownOpen(true)}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen((o) => !o);
          }}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isDropdownOpen && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* DROPDOWN: existing tags and option to add a new one */}
      {isDropdownOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-md border 
                     bg-popover text-popover-foreground shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          {query.trim() && onAddTemplate && (
            <div className="p-2 border-b">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-sm font-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add &quot;{query}&quot;
              </Button>
            </div>
          )}

          <div
            className="max-h-60 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredTags.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No templates found
              </div>
            ) : (
              filteredTags.map((tag) => (
                <div
                  key={tag.value}
                  className="px-3 py-2 text-sm cursor-pointer
                             hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelectTag(tag)}
                >
                  <div className="flex justify-between items-center">
                    <span>{tag.label}</span>
                    {tag.category && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">
                        {tag.category}
                      </span>
                    )}
                  </div>
                  {tag.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {tag.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL FOR CREATING A NEW Template (no <form> element here) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-md shadow-lg w-[90%] max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center mb-4 space-x-2">
                <Tags className="h-5 w-5" />
                <h4 className="font-semibold text-lg">Create New Template</h4>
              </div>
              {newTemplateError && (
                  <div className="text-xs text-red-500 mt-1">{newTemplateError}</div>
                )}
              {/* Template Name */}
              <div>
                <label className="block mb-1 font-medium">Template Name</label>
                <Input
                  name="name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
                
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea
                  name="description"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* NEW: OBJECT DROPDOWN */}
              <div>
                <label className="block mb-1 font-medium">Object</label>
                <select
                  className="w-full border rounded p-2 text-sm"
                  value={selectedObjectId}
                  onChange={(e) => {
                    setSelectedObjectId(e.target.value);
                    // Reset object type when a new object is selected
                    setSelectedObjectTypeId('');
                  }}
                >
                  <option value="">-- Select an Object --</option>
                  {objectsData.map((obj) => (
                    <option key={obj.objectID} value={obj.objectID}>
                      {obj.objectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* NEW: OBJECT TYPE DROPDOWN (depends on selectedObjectId) */}
              <div>
                <label className="block mb-1 font-medium">Object Type</label>
                <select
                  className="w-full border rounded p-2 text-sm"
                  value={selectedObjectTypeId}
                  onChange={(e) => setSelectedObjectTypeId(e.target.value)}
                  disabled={!selectedObjectId} // disable if no object is selected
                >
                  <option value="">-- Select an Object Type --</option>
                  {objectTypesData.map((ot) => (
                    <option key={ot.objectTypeId} value={ot.objectTypeId}>
                      {ot.objectTypeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddTemplate}
                  disabled={isSubmitting || !newTemplateName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Template"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



//Use of this templateSector

{/* <TemplateSelector
id={field.value}
companyId={companyId}
tags={customTags}  // Passed from parent state.
categories={field.categories || []}
onTagSelect={handleTagSelect}
onAddTemplate={async (newTagName) => {
  const createdTag = await createNewTag(newTagName);
  return createdTag;
}}
placeholder="Select or create a tag..."
/> */}