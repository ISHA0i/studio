"use client";

import { useState } from "react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestRelatedTasks, SuggestRelatedTasksInput } from "@/ai/flows/suggest-related-tasks";
import { Sparkles, Loader2, Plus } from "lucide-react";

type AiTaskSuggestionsProps = {
  tasks: Task[];
  onAddTask: (taskText: string) => void;
};

export default function AiTaskSuggestions({ tasks, onAddTask }: AiTaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);

    const existingTasks = tasks.map(task => task.text);

    if (existingTasks.length === 0) {
      setError("Add some tasks first to get suggestions.");
      setLoading(false);
      return;
    }

    try {
      const input: SuggestRelatedTasksInput = { existingTasks };
      const result = await suggestRelatedTasks(input);
      setSuggestions(result.suggestedTasks);
    } catch (err) {
      setError("Failed to get suggestions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSuggestion = (suggestion: string) => {
    onAddTask(suggestion);
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-6 w-6 text-primary" />
          <span>AI Task Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center">
            <p className="mb-4 text-muted-foreground">
                Stuck? Get AI-powered suggestions based on your current tasks.
            </p>
            <Button onClick={handleGetSuggestions} disabled={loading || tasks.length === 0}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Generating..." : "Get Suggestions"}
            </Button>

            {error && <p className="text-destructive mt-4 text-sm">{error}</p>}

            {suggestions.length > 0 && (
                <div className="mt-6 w-full text-left">
                    <h4 className="font-semibold mb-3">Here are some ideas:</h4>
                    <ul className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center justify-between gap-2 p-3 bg-accent/20 rounded-lg group">
                                <span className="text-sm">{suggestion}</span>
                                <Button variant="ghost" size="sm" onClick={() => handleAddSuggestion(suggestion)} aria-label={`Add task: ${suggestion}`}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
