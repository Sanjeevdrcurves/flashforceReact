
import React from "react";
import { Separator } from "@/components/ui/separator";
import { EntitySelector } from "../EntitySelector";

// Mock data for associations (moved from the parent)
const mockContacts = [
  { id: "c1", name: "John Smith" },
  { id: "c2", name: "Emily Johnson" },
  { id: "c3", name: "Michael Brown" },
];

const mockUsers = [
  { id: "u1", name: "Sarah Connor" },
  { id: "u2", name: "James Cameron" },
  { id: "u3", name: "Linda Hamilton" },
];

const mockDeals = [
  { id: "d1", name: "Website Redesign" },
  { id: "d2", name: "Product Launch" },
  { id: "d3", name: "Annual Contract" },
];

const mockProjects = [
  { id: "p1", name: "CRM Implementation" },
  { id: "p2", name: "Mobile App Development" },
  { id: "p3", name: "Marketing Campaign" },
];

const mockOrganizations = [
  { id: "o1", name: "Acme Inc." },
  { id: "o2", name: "Globex Corp." },
  { id: "o3", name: "Stark Industries" },
];

interface AssociationsTabProps {
  contacts: string[];
  setContacts: (ids: string[]) => void;
  users: string[];
  setUsers: (ids: string[]) => void;
  deals: string[];
  setDeals: (ids: string[]) => void;
  projects: string[];
  setProjects: (ids: string[]) => void;
  organizations: string[];
  setOrganizations: (ids: string[]) => void;
}

export const AssociationsTab: React.FC<AssociationsTabProps> = ({
  contacts,
  setContacts,
  users,
  setUsers,
  deals,
  setDeals,
  projects,
  setProjects,
  organizations,
  setOrganizations,
}) => {
  return (
    <div className="space-y-6">
      <EntitySelector 
        title="Contacts"
        entityType="contact"
        selectedIds={contacts}
        entities={mockContacts}
        onSelect={setContacts}
      />
      
      <Separator className="my-6" />
      
      <EntitySelector 
        title="Users"
        entityType="user"
        selectedIds={users || []}
        entities={mockUsers}
        onSelect={setUsers}
      />
      
      <Separator className="my-6" />
      
      <EntitySelector 
        title="Deals"
        entityType="deal"
        selectedIds={deals}
        entities={mockDeals}
        onSelect={setDeals}
      />
      
      <Separator className="my-6" />
      
      <EntitySelector 
        title="Projects"
        entityType="project"
        selectedIds={projects}
        entities={mockProjects}
        onSelect={setProjects}
      />
      
      <Separator className="my-6" />
      
      <EntitySelector 
        title="Organizations"
        entityType="organization"
        selectedIds={organizations}
        entities={mockOrganizations}
        onSelect={setOrganizations}
      />
    </div>
  );
};
