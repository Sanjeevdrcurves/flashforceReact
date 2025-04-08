
import React from "react";
import { Separator } from "@/components/ui/separator";
import { TagSelector } from "@/components/add-activity/TagSelector";
import { ActivityTag } from "@/types/activity";

interface TagsSectionProps {
  tags: ActivityTag[];
  addTag: (name: string, color: string) => void;
  removeTag: (id: string) => void;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  addTag,
  removeTag,
}) => {
  return (
    <>
      <Separator className="my-6" />
      <TagSelector 
        tags={tags || []}
        onAdd={addTag}
        onRemove={removeTag}
      />
    </>
  );
};
