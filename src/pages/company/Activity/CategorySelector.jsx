import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Plus, Loader2, Folder, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategorySelector({
  placeholder = "Select or create a category...",
  onTagSelect,
  defaultId
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Toggles for dropdown & modal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for new category fields
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryError, setNewCategoryError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef(null);

  // 1) Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await axios.get(
          "https://flashforceapi.drcurves.com/api/TagCategory/GetTagCategoryByCompanyId/0"
        );
        // Map API data (assumed shape: { id, tagCategoryName, ... }) to our internal format
        const loaded = (resp.data || []).map(item => ({
          value: item.id,
          label: item.tagCategoryName,
        }));
        setCategories(loaded);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const resp = await axios.get(
        "https://flashforceapi.drcurves.com/api/TagCategory/GetTagCategoryByCompanyId/0"
      );
      // Map API data (assumed shape: { id, tagCategoryName, ... }) to our internal format
      const loaded = (resp.data || []).map(item => ({
        value: item.id,
        label: item.tagCategoryName,
      }));
      setCategories(loaded);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 2) Exclude the selected category from the dropdown list
  const unselectedCategories = selectedCategory
    ? categories.filter(cat => cat.value !== selectedCategory.value)
    : categories;

  // 3) Filter by user query (case-insensitive partial match)
  const filteredCategories = query
    ? unselectedCategories.filter(cat =>
        cat.label.toLowerCase().includes(query.toLowerCase())
      )
    : unselectedCategories;

  // 4) Close dropdown if clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Reset new category fields when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setNewCategoryName(query.trim());
      setNewCategoryDescription('');
      setNewCategoryError('');
    }
  }, [isModalOpen, query]);

  // 5) Create a new category using state (no form element)
  const handleNewCategorySubmit = async () => {
    // Validate new category name
    if (!newCategoryName.trim()) {
      setNewCategoryError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const name = newCategoryName.trim();
      const companyId = 1; // Example value
      const createdBy = 23; // Example value
      const url = `https://flashforceapi.drcurves.com/api/TagCategory/InsertTagCategory?tagCategory=${encodeURIComponent(name)}&companyId=${companyId}&createdBy=${createdBy}`;
      
      const resp = await axios.post(url);

      // Assume the API returns the new category object
      const newCat = {
        value: resp.data.id,
        label: resp.data.tagCategoryName,
      };

      // Immediately select the new category
    //   setSelectedCategory(newCat);
    //   onTagSelect(newCat);

      // Reset fields and close modal/dropdown
      setNewCategoryName('');
      setNewCategoryDescription('');
      setQuery('');
      fetchCategories();
      setIsModalOpen(false);
      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Error adding new category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6) Select an existing category
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    onTagSelect(cat);
    setQuery('');
    setIsDropdownOpen(false);
  };

  // 7) Remove the selected category
  const handleRemoveCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* MAIN INPUT AREA + SELECTED CATEGORY CHIP */}
      <div
        className="flex flex-wrap items-center gap-2 w-full rounded-md border border-input bg-background p-1 
                   focus-within:ring-1 focus-within:ring-ring"
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(true);
        }}
      >
        {selectedCategory && (
          <div className="flex items-center rounded px-2 py-1 text-sm bg-primary/10 border border-primary/20">
            <span>{selectedCategory.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCategory();
              }}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <Input
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
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
            setIsDropdownOpen((prev) => !prev);
          }}
        >
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isDropdownOpen && "rotate-180")} />
        </Button>
      </div>

      {/* DROPDOWN */}
      {isDropdownOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Show "Add {query}" button if query is non-empty and no partial match exists */}
          {query.trim() && filteredCategories.length === 0 && (
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
                Add "{query}" (no matches found)
              </Button>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length === 0 && !query.trim() ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No categories found
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div
                  key={cat.value}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelectCategory(cat)}
                >
                  {cat.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL FOR CREATING A NEW CATEGORY */}
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
                <Folder className="h-5 w-5" />
                <h4 className="font-semibold text-lg">Create New Category</h4>
              </div>

              {/* NAME FIELD */}
              <div>
                <label className="block mb-1 font-medium">Category Name</label>
                <Input
                  name="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
                {newCategoryError && (
                  <div className="text-xs text-red-500 mt-1">{newCategoryError}</div>
                )}
              </div>

              {/* DESCRIPTION FIELD */}
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea
                  name="description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Enter category description"
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleNewCategorySubmit}
                  disabled={isSubmitting || !newCategoryName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
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
