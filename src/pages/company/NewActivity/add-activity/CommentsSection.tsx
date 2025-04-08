
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { X, MessageSquare, Send } from 'lucide-react';
import { Comment } from '@/types/activity';
import { format } from 'date-fns';

interface CommentsSectionProps {
  comments: Comment[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
}

// Renamed to ActivityCommentsSection to avoid naming conflicts
export const ActivityCommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAdd,
  onRemove,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAdd(newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium text-sm flex items-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          Comments
        </h3>
      </div>

      <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2 group">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium">
                {comment.author.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <div className="flex-1 bg-gray-50 rounded-md p-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{comment.author}</div>
                <div className="text-xs text-gray-500">
                  {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                </div>
              </div>
              <p className="mt-1 whitespace-pre-wrap">{comment.text}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(comment.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 min-h-[80px] resize-none"
          onKeyDown={handleKeyDown}
        />
        <Button 
          size="icon" 
          className="mt-1"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-gray-500">Press Ctrl+Enter to send</div>
    </div>
  );
};
