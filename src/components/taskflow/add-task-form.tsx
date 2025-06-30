"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AddTaskFormProps = {
  onAddTask: (text: string) => void;
};

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask("");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Add a New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="e.g., Finish project report"
            className="flex-grow"
            aria-label="New task description"
          />
          <Button type="submit" aria-label="Add task">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
