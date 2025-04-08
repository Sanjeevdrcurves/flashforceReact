
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactPerson } from "../types";
import ContactPersonEntries from "../ContactPersonEntries";

interface PlaceFieldsProps {
  selectedType: string;
  company: string;
  setCompany: (value: string) => void;
  contactPersons: ContactPerson[];
  updateContactPerson: (id: string, field: keyof ContactPerson, value: string) => void;
  addContactPerson: () => void;
  removeContactPerson: (id: string) => void;
}

const PlaceFields: React.FC<PlaceFieldsProps> = ({
  selectedType,
  company,
  setCompany,
  contactPersons,
  updateContactPerson,
  addContactPerson,
  removeContactPerson,
}) => {
  switch (selectedType) {
    case "company":
    case "account":
    case "vendor":
      return (
        <>
          <div className="space-y-2 mb-6">
            <Label htmlFor="companyName">Company/Organization Name</Label>
            <Input 
              id="companyName" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="border-slate-200 focus:border-blue-500 bg-white"
            />
          </div>
          
          {selectedType === "company" && (
            <div className="space-y-2 mb-6">
              <Label htmlFor="industry">Industry</Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedType === "company" && (
            <div className="space-y-2 mb-6">
              <Label htmlFor="size">Company Size</Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedType === "vendor" && (
            <div className="space-y-2 mb-6">
              <Label htmlFor="vendorType">Vendor Type</Label>
              <Select>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select vendor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <ContactPersonEntries
            contactPersons={contactPersons}
            updateContactPerson={updateContactPerson}
            addContactPerson={addContactPerson}
            removeContactPerson={removeContactPerson}
          />
        </>
      );

    default:
      return null;
  }
};

export default PlaceFields;
