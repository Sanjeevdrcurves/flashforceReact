
import React from "react";
import { Paperclip, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ContactsActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1.5"
      >
        <Paperclip size={16} />
        Attach
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>Export filtered results</DropdownMenuItem>
          <DropdownMenuItem>Import data</DropdownMenuItem>
          <DropdownMenuItem>Open data cleanup</DropdownMenuItem>
          <DropdownMenuItem>Show on map</DropdownMenuItem>
          <DropdownMenuItem>Merge duplicates</DropdownMenuItem>
          <DropdownMenuItem>Bulk actions</DropdownMenuItem>
          <DropdownMenuItem>Restore data</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ContactsActions;
