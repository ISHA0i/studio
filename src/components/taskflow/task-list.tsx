"use client";

import type { Task } from "@/types";
import { TaskItem } from "./task-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TaskListProps = {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ title, tasks, emptyMessage, onToggle, onDelete }: TaskListProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
