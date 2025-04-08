
import React from "react";
import { Separator } from "@/components/ui/separator";
import { TagSelector } from "@/components/add-activity/TagSelector";

const TagsSection = ({
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

export { TagsSection };
