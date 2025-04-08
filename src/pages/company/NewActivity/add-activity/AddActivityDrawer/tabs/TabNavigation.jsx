import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabNavigation = ({ activeTab }) => {
  return (
    <TabsList className="w-full grid grid-cols-3 h-10 mb-6 bg-muted/50">
      <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
      <TabsTrigger value="findTime" className="text-sm">Find a Time</TabsTrigger>
      <TabsTrigger value="associations" className="text-sm">Associations</TabsTrigger>
    </TabsList>
  );
};
