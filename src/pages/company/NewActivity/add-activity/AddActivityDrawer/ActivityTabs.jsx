
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  TabNavigation, 
  DetailTabContent, 
  FindTimeTabContent, 
  AssociationsTabContent 
} from "./tabs";

const ActivityTabs = ({
  activeTab,
  setActiveTab,
  formState,
  showCalendarView,
  setShowCalendarView,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabNavigation activeTab={activeTab} />
      
      {/* Details Tab */}
      <TabsContent value="details">
        <DetailTabContent formState={formState} />
      </TabsContent>
      
      {/* Find a Time Tab */}
      <TabsContent value="findTime">
        <FindTimeTabContent formState={formState} />
      </TabsContent>
      
      {/* Associations Tab */}
      <TabsContent value="associations">
        <AssociationsTabContent formState={formState} />
      </TabsContent>
    </Tabs>
  );
};

export { ActivityTabs };
