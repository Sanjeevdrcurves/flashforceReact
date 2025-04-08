
import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactsSearchProps {
  showSearchBar: boolean;
  setShowSearchBar: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleSearchBar: () => void;
}

const ContactsSearch = ({
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
  toggleSearchBar,
}: ContactsSearchProps) => {
  return (
    <>
      {showSearchBar ? (
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-9 h-9 min-w-[220px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            onBlur={() => {
              if (searchQuery === "") {
                setShowSearchBar(false);
              }
            }}
          />
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={toggleSearchBar} className="gap-1.5">
          <Search size={16} />
        </Button>
      )}
    </>
  );
};

export default ContactsSearch;
