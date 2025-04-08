
import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

// Import drawer sections
import { DrawerHeader, DrawerForm, DrawerFooter } from "./drawer-sections";

// Import validation utils
import { validateContactForm, prepareContactData } from "./utils/validation";

// Import form hook
import { useContactForm } from "./useContactForm";

// Import types
import { ContactData } from "./types";

interface AddContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (contactData: ContactData) => void;
  isAdmin?: boolean;
}

const AddContactDrawer: React.FC<AddContactDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  isAdmin = false,
}) => {
  const {
    formState,
    handlers,
    resetForm
  } = useContactForm();
  
  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  console.log("Current form state - Category:", formState.selectedCategory, "Type:", formState.selectedType);

  const handleSaveContact = () => {
    const { selectedCategory, selectedType, firstName, lastName, company } = formState;
    
    // Validate form
    if (!validateContactForm(selectedCategory, selectedType, firstName, lastName, company)) {
      return;
    }

    // Prepare contact data
    const contactData = prepareContactData(formState);

    // Call onSave callback
    if (onSave) {
      onSave(contactData);
    }

    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="sm:max-w-md w-[90vw] p-0 border-l border-slate-200 shadow-xl"
      >
        <div className="flex flex-col h-full">
          <DrawerHeader />
          
          <DrawerForm 
            formState={formState}
            handlers={handlers}
            isAdmin={isAdmin}
          />
          
          <DrawerFooter onSave={handleSaveContact} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddContactDrawer;
