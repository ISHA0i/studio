'use server';

/**
 * @fileOverview Provides AI-driven suggestions for related tasks based on existing to-do items.
 *
 * - suggestRelatedTasks - A function that suggests related tasks.
 * - SuggestRelatedTasksInput - The input type for the suggestRelatedTasks function.
 * - SuggestRelatedTasksOutput - The return type for the suggestRelatedTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedTasksInputSchema = z.object({
  existingTasks: z
    .array(z.string())
    .describe('A list of existing tasks in the to-do list.'),
});
export type SuggestRelatedTasksInput = z.infer<typeof SuggestRelatedTasksInputSchema>;

const SuggestRelatedTasksOutputSchema = z.object({
  suggestedTasks: z
    .array(z.string())
    .describe('A list of suggested tasks related to the existing tasks.'),
});
export type SuggestRelatedTasksOutput = z.infer<typeof SuggestRelatedTasksOutputSchema>;

export async function suggestRelatedTasks(
  input: SuggestRelatedTasksInput
): Promise<SuggestRelatedTasksOutput> {
  return suggestRelatedTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedTasksPrompt',
  input: {schema: SuggestRelatedTasksInputSchema},
  output: {schema: SuggestRelatedTasksOutputSchema},
  prompt: `You are a helpful AI assistant that suggests related tasks based on a user's existing to-do list.

Given the following list of existing tasks, suggest additional tasks that the user might want to add to their to-do list.

Existing Tasks:
{{#each existingTasks}}- {{this}}\n{{/each}}

Suggested Tasks:
`,
});

const suggestRelatedTasksFlow = ai.defineFlow(
  {
    name: 'suggestRelatedTasksFlow',
    inputSchema: SuggestRelatedTasksInputSchema,
    outputSchema: SuggestRelatedTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
