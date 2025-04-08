
import { useState, useCallback, useEffect } from "react";

export const useBasicFields = () => {
  // Category and type selection
  const [selectedCategory, setSelectedCategory] = useState<"person" | "place">("person");
  const [selectedType, setSelectedType] = useState("person");
  
  // Basic fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [birthday, setBirthday] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [photoUrl, setPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");

  // Category change handler with proper default type setting
  const handleCategoryChange = useCallback((category: "person" | "place") => {
    console.log("Category changed to:", category);
    setSelectedCategory(category);
    
    // Set default type based on category
    if (category === "person") {
      setSelectedType("person");
    } else if (category === "place") {
      setSelectedType("company");
    }
  }, []);

  // Make sure selectedType is always valid for the current category
  useEffect(() => {
    if (selectedCategory === "person" && 
        !["person", "lead", "prospect", "deal"].includes(selectedType)) {
      setSelectedType("person");
    } else if (selectedCategory === "place" && 
               !["company", "account", "vendor"].includes(selectedType)) {
      setSelectedType("company");
    }
  }, [selectedCategory, selectedType]);

  return {
    selectedCategory,
    selectedType,
    firstName,
    lastName,
    company,
    location,
    birthday,
    description,
    timezone,
    visibility,
    photoUrl,
    notes,
    setSelectedCategory: handleCategoryChange,
    setSelectedType,
    setFirstName,
    setLastName,
    setCompany,
    setLocation,
    setBirthday,
    setDescription,
    setTimezone,
    setVisibility,
    setPhotoUrl,
    setNotes
  };
};
