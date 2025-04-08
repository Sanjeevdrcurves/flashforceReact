
import React from "react";
import { Separator } from "@/components/ui/separator";
import { TasksList } from "@/components/add-activity/TasksList";

interface TasksSectionProps {
  tasks: Array<{ id: string; title: string; completed: boolean }>;
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, field: string, value: any) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  addTask,
  removeTask,
  updateTask,
}) => {
  return (
    <>
      <Separator className="my-6" />
      <TasksList 
        tasks={tasks || []}
        onAdd={addTask}
        onRemove={removeTask}
        onUpdate={updateTask}
      />
    </>
  );
};
