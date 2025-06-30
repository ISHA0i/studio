"use client";

import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-lg transition-all duration-300 hover:bg-accent/50 group animate-in fade-in-50">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-labelledby={`task-label-${task.id}`}
      />
      <label
        htmlFor={`task-${task.id}`}
        id={`task-label-${task.id}`}
        className={`flex-grow text-sm cursor-pointer transition-colors ${
          task.completed ? "text-muted-foreground line-through" : ""
        }`}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </li>
  );
}
