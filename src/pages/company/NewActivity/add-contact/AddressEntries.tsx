
import React from "react";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddressEntry } from "./types";

interface AddressEntriesProps {
  addressEntries: AddressEntry[];
  updateAddressEntry: (id: string, field: keyof AddressEntry, value: string) => void;
  addAddressEntry: () => void;
  removeAddressEntry: (id: string) => void;
}

const AddressEntries: React.FC<AddressEntriesProps> = ({
  addressEntries,
  updateAddressEntry,
  addAddressEntry,
  removeAddressEntry,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Addresses</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addAddressEntry}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add Address
        </Button>
      </div>
      
      {addressEntries.length > 0 ? (
        <div className="space-y-4">
          {addressEntries.map((entry) => (
            <div key={entry.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Address</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeAddressEntry(entry.id)}
                  className="h-6 text-gray-400 hover:text-red-500"
                >
                  <Trash size={14} />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Input 
                  value={entry.street} 
                  onChange={(e) => updateAddressEntry(entry.id, 'street', e.target.value)}
                  placeholder="Street address" 
                  className="bg-white"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    value={entry.city} 
                    onChange={(e) => updateAddressEntry(entry.id, 'city', e.target.value)}
                    placeholder="City" 
                    className="bg-white"
                  />
                  <Input 
                    value={entry.state} 
                    onChange={(e) => updateAddressEntry(entry.id, 'state', e.target.value)}
                    placeholder="State/Province" 
                    className="bg-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    value={entry.zipCode} 
                    onChange={(e) => updateAddressEntry(entry.id, 'zipCode', e.target.value)}
                    placeholder="ZIP/Postal code" 
                    className="bg-white"
                  />
                  <Input 
                    value={entry.country} 
                    onChange={(e) => updateAddressEntry(entry.id, 'country', e.target.value)}
                    placeholder="Country" 
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No addresses added yet
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressEntries;
