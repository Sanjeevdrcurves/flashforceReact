import { toast } from "@/hooks/use-toast";

export const validateContactForm = (
  selectedCategory,
  selectedType,
  firstName,
  lastName,
  company
) => {
  if (
    selectedCategory === "person" &&
    selectedType !== "deal" &&
    (!firstName || !lastName)
  ) {
    toast({
      title: "Validation Error",
      description:
        "First name and last name are required for person contacts",
      variant: "destructive",
    });
    return false;
  }

  if (selectedCategory === "place" && !company) {
    toast({
      title: "Validation Error",
      description:
        "Company/organization name is required for place contacts",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

export const prepareContactData = (formState) => {
  const {
    selectedType,
    selectedCategory,
    firstName,
    lastName,
    company,
    birthday,
    description,
    timezone,
    visibility,
    phoneEntries,
    emailEntries,
    socialMediaEntries,
    addressEntries,
    labels,
    urls,
    photoUrl,
    dndSettings,
    contactPersons,
  } = formState;

  return {
    type: selectedType,
    category: selectedCategory,
    firstName,
    lastName,
    company,
    location: "",
    birthday: birthday || "",
    description,
    timezone,
    visibility,
    phoneEntries,
    emailEntries,
    socialMediaEntries,
    addressEntries,
    labels,
    urls,
    notes: "",
    photoUrl,
    dndSettings,
    contactPersons: selectedCategory === "place" ? contactPersons : undefined,
  };
};
