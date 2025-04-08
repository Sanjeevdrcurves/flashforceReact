
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

interface PersonFieldsProps {
  selectedType: string;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  birthday: string;
  setBirthday: (value: string) => void;
}

const PersonFields: React.FC<PersonFieldsProps> = ({
  selectedType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  company,
  setCompany,
  birthday,
  setBirthday,
}) => {
  switch (selectedType) {
    case "person":
    case "prospect":
      return (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="border-slate-200 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="border-slate-200 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          
          {/* Company/Place (Association) */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="company">Company/Organization</Label>
            <Input 
              id="company" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="border-slate-200 focus:border-blue-500 bg-white"
              placeholder="Where this person works or is associated with"
            />
          </div>
          
          {/* Birthday field */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="birthday">Birthday</Label>
            <Input 
              id="birthday" 
              type="date" 
              value={birthday} 
              onChange={(e) => setBirthday(e.target.value)}
              className="border-slate-200 focus:border-blue-500 bg-white"
            />
          </div>
        </>
      );
      
    case "lead":
      return (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="border-slate-200 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="border-slate-200 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          
          {/* Company/Place (Association) */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="company">Company/Organization</Label>
            <Input 
              id="company" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="border-slate-200 focus:border-blue-500 bg-white"
            />
          </div>
          
          <div className="space-y-2 mb-6">
            <Label htmlFor="leadSource">Lead Source</Label>
            <Select>
              <SelectTrigger className="border-slate-200 focus:border-blue-500 bg-white">
                <SelectValue placeholder="Select lead source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="email">Email Campaign</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );

    case "deal":
      return (
        <>
          <div className="space-y-2 mb-6">
            <Label htmlFor="dealName">Deal Name</Label>
            <Input 
              id="dealName" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              className="border-slate-200 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="company">Associated Company</Label>
            <Input 
              id="company" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="border-slate-200 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              className="border-slate-200 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="stage">Stage</Label>
            <Select>
              <SelectTrigger className="border-slate-200 focus:border-blue-500 bg-white">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed (Won)</SelectItem>
                <SelectItem value="closed-lost">Closed (Lost)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );

    default:
      return null;
  }
};

export default PersonFields;
