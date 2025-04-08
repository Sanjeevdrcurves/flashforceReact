
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ActivityCommentsSection } from "@/components/add-activity";
import { Comment } from "@/types/activity";

interface CommentsSectionProps {
  comments: Comment[];
  addComment: (text: string) => void;
  removeComment: (id: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
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
