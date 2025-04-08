
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AddActivityDrawer } from './AddActivityDrawer/index';

const NewActivityButton = ({ 
  children, 
  contactId,
  className 
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  
  const handleAddActivity = (activity) => {
    console.log("Adding new activity:", activity);
    toast({
      title: "Activity added",
      description: "The activity has been successfully added.",
    });
    setShowDrawer(false);
  };
  
  return (
    <>
      <button 
        className={className}
        onClick={() => setShowDrawer(true)}
      >
        {children}
      </button>
      
      <AddActivityDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSave={handleAddActivity}
        contactId={contactId}
      />
    </>
  );
};

export { NewActivityButton };
