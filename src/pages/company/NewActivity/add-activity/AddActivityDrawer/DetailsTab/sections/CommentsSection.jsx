
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ActivityCommentsSection } from "@/components/add-activity";

const CommentsSection = ({
  comments,
  addComment,
  removeComment,
}) => {
  return (
    <>
      <Separator className="my-6" />
      <ActivityCommentsSection 
        comments={comments || []}
        onAdd={addComment}
        onRemove={removeComment}
      />
    </>
  );
};

export { CommentsSection };
