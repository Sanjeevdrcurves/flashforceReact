import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Plus, Loader2, Tags, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import CategorySelector from './CategorySelector';
import { useNavigate } from 'react-router-dom';

// Replace with your actual API or environment variable
const API_URL = import.meta.env?.VITE_FLASHFORCE_API_URL || 'https://example.com';

export default function TagSelector({
  tags = [],         // fallback array of tags
  categories = [],   // optional array of categories
  onTagSelect,       // callback when a tag is selected
  onAddTag,          // callback for creating a new tag
  id,                // value received from GetObjectCustomFields (should be numeric e.g. "9")
  companyId,         // used for API call
  placeholder = "Apply new or existing tag...",
}) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New tag input state
  const [newTagName, setNewTagName] = useState(query.trim() || '');
  const [newTagCategory, setNewTagCategory] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newTagError, setNewTagError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Determine the correct tag category value.
  // If id is an object with a "value" property (e.g. coming directly from GetObjectCustomFields),
  // use that. Otherwise, assume it's already the correct value.
  const tagCategoryValue = typeof id === 'object' && id.value ? id.value : id;

  // Fetch tags from API using the correct tag category value
  useEffect(() => {
    const fetchCustomTags = async () => {
      try {
        const resp = await axios.get(
          `${API_URL}/Tag/GetTagsByTagCategory/${tagCategoryValue}/${companyId}`
        );
        const loaded = (resp.data || []).map((t) => ({
          value: t.tagID,
          label: t.tagName,
          category: t.category,
          description: t.description,
        }));
        setCustomTags(loaded);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    if (tagCategoryValue && companyId) {
      fetchCustomTags();
    }
  }, [tagCategoryValue, companyId]);

  // Merge fetched tags with fallback
  const allTags = customTags.length ? customTags : tags;

  // Exclude already-selected tags
  const unselectedTags = allTags.filter(
    (t) => !selectedTags.some((s) => s.value === t.value)
  );

  // Filter tags by search query
  const filteredTags = query
    ? unselectedTags.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase())
      )
    : unselectedTags;

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

  // Reset new tag inputs when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setNewTagName(query.trim() || '');
      setNewTagCategory('');
      setNewTagDescription('');
      setNewTagError('');
    }
  }, [isModalOpen, query]);

  // Function to re-fetch custom tags after a new tag is created
  const refetchCustomTags = async () => {
    try {
      const resp = await axios.get(
        `${API_URL}/Tag/GetTagsByTagCategory/${tagCategoryValue}/${companyId}`
      );
      const loaded = (resp.data || []).map((t) => ({
        value: t.tagID,
        label: t.tagName,
        category: t.category,
        description: t.description,
      }));
      setCustomTags(loaded);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  // Handle new tag creation without a <form>
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      setNewTagError("Tag name is required");
      return;
    }
    setNewTagError("");
    if (!onAddTag) return;
    setIsSubmitting(true);
    try {
      const apiUrl = `${API_URL}/Tag/InsertTag?description=${encodeURIComponent(
        newTagDescription
      )}&tagCategoryId=${newTagCategory.value}&tagName=${encodeURIComponent(
        newTagName
      )}&createdBy=12&companyId=${companyId}`;
      const response = await axios.post(apiUrl);
      if (response) {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setIsSubmitting(false);
        setNewTagName('');
        refetchCustomTags();
        setQuery('');
        setNewTagDescription('');
      }
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending tag:', error);
    }
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    // Optionally navigate to a different route after tag creation
    // navigate("/tags");
  };

  // Select an existing tag
  const handleSelectTag = (tag) => {
    setSelectedTags((prev) => [...prev, tag]);
    onTagSelect?.(tag);
    setQuery('');
    setIsDropdownOpen(false);
  };

  // Remove a selected tag
  const handleRemoveTag = (tag) => {
    setSelectedTags((prev) => prev.filter((x) => x.value !== tag.value));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* MAIN INPUT + SELECTED TAGS */}
      <div
        className="flex flex-wrap items-center gap-2 w-full rounded-md border border-input bg-background p-1 focus-within:ring-1 focus-within:ring-ring"
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(true);
        }}
      >
        {selectedTags.map((tag) => (
          <div
            key={tag.value}
            className="flex items-center rounded px-2 py-1 text-sm bg-primary/10 border border-primary/20"
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
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
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
          className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          {query.trim() && onAddTag && filteredTags.length === 0 && (
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
                Add "{query}"
              </Button>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {filteredTags.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No tags found
              </div>
            ) : (
              filteredTags.map((tag) => (
                <div
                  key={tag.value}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
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

      {/* MODAL FOR CREATING A NEW TAG */}
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
                <h4 className="font-semibold text-lg">Create New Tag</h4>
              </div>
              {/* Tag Name */}
              <div>
                <label className="block mb-1 font-medium">Tag Name</label>
                <Input
                  name="name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                />
                {newTagError && (
                  <div className="text-xs text-red-500 mt-1">{newTagError}</div>
                )}
              </div>
              {/* Category */}
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <CategorySelector
                  id={''}
                  companyId={companyId}
                  tags={customTags}
                  categories={[]}
                  onTagSelect={(category) => setNewTagCategory(category)}
                  placeholder="Select or create a Category..."
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Choose a category for your tag
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea
                  name="description"
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                  placeholder="Enter tag description"
                  className="resize-none"
                  rows={3}
                />
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
                  onClick={handleAddTag}
                  disabled={isSubmitting || !newTagName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Tag"
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
