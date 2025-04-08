
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Plus, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksListProps {
  tasks: Task[];
  onAdd: (title: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
}

export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium text-sm flex items-center">
          <CheckSquare className="mr-2 h-4 w-4" />
          Tasks
        </h3>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => 
                onUpdate(task.id, 'completed', Boolean(checked))
              }
              id={`task-${task.id}`}
            />
            <Input
              value={task.title}
              onChange={(e) => onUpdate(task.id, 'title', e.target.value)}
              className={`flex-1 h-8 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(task.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-8"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
