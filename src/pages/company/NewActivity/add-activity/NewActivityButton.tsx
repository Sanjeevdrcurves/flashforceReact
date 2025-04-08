
import React, { useState } from 'react';
import { Activity } from '@/types/activity';
import { toast } from '@/hooks/use-toast';
import { AddActivityDrawer } from './AddActivityDrawer/index';

interface NewActivityButtonProps {
  children: React.ReactNode;
  contactId?: string;
  className?: string;
}

export const NewActivityButton: React.FC<NewActivityButtonProps> = ({ 
  children, 
  contactId,
  className 
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  
  const handleAddActivity = (activity: Activity) => {
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
