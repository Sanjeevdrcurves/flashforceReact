
import React from "react";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactPerson } from "./types";

interface ContactPersonEntriesProps {
  contactPersons: ContactPerson[];
  updateContactPerson: (id: string, field: keyof ContactPerson, value: string) => void;
  addContactPerson: () => void;
  removeContactPerson: (id: string) => void;
}

const ContactPersonEntries: React.FC<ContactPersonEntriesProps> = ({
  contactPersons,
  updateContactPerson,
  addContactPerson,
  removeContactPerson,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Contact Persons</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addContactPerson}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add Contact Person
        </Button>
      </div>

      {contactPersons.length > 0 ? (
        <div className="space-y-3">
          {contactPersons.map((person) => (
            <div key={person.id} className="grid grid-cols-[1fr,1fr,auto] gap-2">
              <Input
                value={person.name}
                onChange={(e) => updateContactPerson(person.id, 'name', e.target.value)}
                placeholder="Full name"
                className="flex-grow bg-white"
              />
              
              <Input
                value={person.title}
                onChange={(e) => updateContactPerson(person.id, 'title', e.target.value)}
                placeholder="Job title"
                className="flex-grow bg-white"
              />
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeContactPerson(person.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No contact persons added yet
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactPersonEntries;
