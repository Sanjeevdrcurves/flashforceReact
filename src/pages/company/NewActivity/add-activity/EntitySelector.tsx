
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { X, Check, ChevronsUpDown, Search, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Entity {
  id: string;
  name: string;
  type?: string;
}

interface EntitySelectorProps {
  title: string;
  entityType: string;
  selectedIds: string[];
  entities: Entity[];
  onSelect: (ids: string[]) => void;
}

export const EntitySelector: React.FC<EntitySelectorProps> = ({
  title,
  entityType,
  selectedIds,
  entities,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEntities = entities.filter(entity => selectedIds.includes(entity.id));
  
  const toggleEntity = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-medium text-sm flex items-center">
          <Link className="mr-2 h-4 w-4" />
          {title}
        </h3>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedIds.length > 0 ? `${selectedIds.length} ${entityType}${selectedIds.length > 1 ? 's' : ''} selected` : `Select ${entityType}s`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={`Search ${entityType}s...`} 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No {entityType} found.</CommandEmpty>
              <CommandGroup>
                {entities.map(entity => (
                  <CommandItem
                    key={entity.id}
                    value={entity.id}
                    onSelect={() => toggleEntity(entity.id)}
                    className="flex items-center justify-between"
                  >
                    <div>{entity.name}</div>
                    <div className={cn(
                      "flex items-center justify-center h-5 w-5 rounded-full",
                      selectedIds.includes(entity.id)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-0"
                    )}>
                      {selectedIds.includes(entity.id) && <Check className="h-3 w-3" />}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedEntities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedEntities.map(entity => (
            <Badge 
              key={entity.id} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {entity.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleEntity(entity.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
