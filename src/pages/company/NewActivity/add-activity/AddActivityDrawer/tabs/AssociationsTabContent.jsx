import React from "react";
import { AssociationsTab } from "../AssociationsTab";

export const AssociationsTabContent = ({ formState }) => {
  return (
    <AssociationsTab 
      contacts={formState.contacts}
      setContacts={formState.setContacts}
      users={formState.users || []}
      setUsers={formState.setUsers}
      deals={formState.deals}
      setDeals={formState.setDeals}
      projects={formState.projects}
      setProjects={formState.setProjects}
      organizations={formState.organizations}
      setOrganizations={formState.setOrganizations}
    />
  );
};
