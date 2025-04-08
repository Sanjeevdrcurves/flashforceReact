
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Tag } from 'lucide-react';
import { ActivityTag } from '@/types/activity';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TagSelectorProps {
  tags: ActivityTag[];
  onAdd: (name: string, color: string) => void;
  onRemove: (id: string) => void;
}

const colorOptions = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // pink
  '#6b7280', // gray
];

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  onAdd,
  onRemove,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAdd(newTagName.trim(), selectedColor);
      setNewTagName('');
      setIsColorPickerOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium text-sm flex items-center">
          <Tag className="mr-2 h-4 w-4" />
          Tags
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div 
            key={tag.id} 
            className="flex items-center rounded-full px-3 py-1 text-sm"
            style={{ 
              backgroundColor: `${tag.color}20`, // 20% opacity
              color: tag.color,
              border: `1px solid ${tag.color}40` // 40% opacity
            }}
          >
            <span>{tag.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 ml-1 hover:bg-transparent"
              onClick={() => onRemove(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 rounded-full flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <Input
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
              </div>

              <div className="grid grid-cols-5 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      backgroundColor: color,
                      border: selectedColor === color ? '2px solid white' : 'none',
                      boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : 'none'
                    }}
                    onClick={() => setSelectedColor(color)}
                    type="button"
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
