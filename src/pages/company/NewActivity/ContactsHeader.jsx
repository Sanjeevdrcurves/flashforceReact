import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ContactsFilter from "./ContactsFilter";
import { NewActivityButton } from "./add-activity/NewActivityButton";


import ContactsSearch from "./ContactsSearch"
import ContactsActions from "./ContactsActions";
const ContactsHeader = ({
  selectedFilter,
  setSelectedFilter,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
  toggleSearchBar,
  showFilterDrawer,
  setShowFilterDrawer,
  filterOptions,
}) => {
  const [showAddContactDrawer, setShowAddContactDrawer] = useState(false);

  const handleAddContact = (contactData) => {
    // In a real app, you'd handle adding the new contact to your database here
    console.log("Adding new contact:", contactData);
    toast({
      title: "Contact added",
      description: "The contact has been successfully added.",
    });
  };

  return (
    <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-white to-slate-50 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all luxury-shadow"
            onClick={() => setShowAddContactDrawer(true)}
          >
            <Plus size={16} />
            Add Contact
          </Button>

          <NewActivityButton className="inline-flex items-center justify-center gap-1.5 shadow-sm transition-all rounded-md text-sm font-medium h-9 px-3 py-2 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <Plus size={16} />
            Add Activity
          </NewActivityButton>

          <ContactsFilter
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            showFilterDrawer={showFilterDrawer}
            setShowFilterDrawer={setShowFilterDrawer}
            filterOptions={filterOptions}
          />
        </div>

        <div className="flex items-center gap-2">
          <ContactsSearch
            showSearchBar={showSearchBar}
            setShowSearchBar={setShowSearchBar}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleSearchBar={toggleSearchBar}
          />
          <ContactsActions />
        </div>
      </div>

      {/* Add Contact Drawer */}
      <AddContactDrawer
        isOpen={showAddContactDrawer}
        onClose={() => setShowAddContactDrawer(false)}
        onSave={handleAddContact}
        isAdmin={true} // for demonstration, enabling admin features
      />
    </div>
  );
};

export default ContactsHeader;
