
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, ArrowDown } from "lucide-react";



const ContactsFilter = ({
  selectedFilter,
  setSelectedFilter,
  showFilterDrawer,
  setShowFilterDrawer,
  filterOptions,
}) => {
  return (
    <div className="flex items-center gap-1 ml-4">
      {filterOptions.map(filter => (
        <Button 
          key={filter.id}
          variant={selectedFilter === filter.id ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-xs"
          onClick={() => setSelectedFilter(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1.5 ml-2"
        onClick={() => setShowFilterDrawer(true)}
      >
        <Filter size={16} />
        <ArrowDown size={12} />
      </Button>
    </div>
  );
};

export default ContactsFilter;
