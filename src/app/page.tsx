"use client";

import { useState, useMemo, useEffect } from "react";
import type { Task } from "@/types";
import { AddTaskForm } from "@/components/taskflow/add-task-form";
import { TaskList } from "@/components/taskflow/task-list";
import AiTaskSuggestions from "@/components/taskflow/ai-suggestions";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskFlowPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      localStorage.removeItem("tasks");
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const handleAddTask = (taskText: string) => {
    if (taskText.trim() === "") return;
    const newTaskItem: Task = {
      id: Date.now().toString(),
      text: taskText.trim(),
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTaskItem]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const pendingTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.completed), [tasks]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4 md:p-8">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-headline font-bold text-primary">TaskFlow</h1>
            <p className="text-muted-foreground mt-2">Your daily task management companion</p>
          </header>
          <div className="max-w-2xl mx-auto mb-8">
            <Skeleton className="h-[124px] w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="max-w-2xl mx-auto mt-8">
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-headline font-bold text-primary">TaskFlow</h1>
          <p className="text-muted-foreground mt-2">Your daily task management companion</p>
        </header>

        <AddTaskForm onAddTask={handleAddTask} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <TaskList 
            title="Pending"
            tasks={pendingTasks}
            emptyMessage="No pending tasks. Great job!"
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
          <TaskList 
            title="Completed"
            tasks={completedTasks}
            emptyMessage="No tasks completed yet."
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </div>
        
        <div className="max-w-2xl mx-auto mt-8">
            <AiTaskSuggestions tasks={tasks} onAddTask={handleAddTask} />
        </div>
      </main>
    </div>
  );
}
