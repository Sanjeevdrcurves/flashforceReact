
import React from "react";
import { Separator } from "@/components/ui/separator";
import { TasksList } from "@/components/add-activity/TasksList";

const TasksSection = ({
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

export { TasksSection };
