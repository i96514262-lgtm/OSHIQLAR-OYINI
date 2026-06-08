'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI-powered dice roll simulation
 * for the 'Tosh tashlash' game, allowing an intelligent bot to simulate dice rolls.
 *
 * - aiDiceRollSimulation - A function that triggers the AI bot's dice roll simulation.
 * - AIDiceRollInput - The input type for the aiDiceRollSimulation function.
 * - AIDiceRollOutput - The return type for the aiDiceRollSimulation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIDiceRollInputSchema = z.object({
  playerScore: z.number().describe("The current score of the human player."),
  botScore: z.number().describe("The current score of the AI bot."),
  playerLastRoll: z.array(z.number().int().min(1).max(6)).optional().describe("The result of the player's last two dice rolls, if any."),
  gamePhase: z.string().optional().describe("Current phase of the game (e.g., 'opening', 'midgame', 'endgame') to inform bot strategy."),
});
export type AIDiceRollInput = z.infer<typeof AIDiceRollInputSchema>;

const AIDiceRollOutputSchema = z.object({
  dice1: z.number().int().min(1).max(6).describe("The result of the first die roll (1-6)."),
  dice2: z.number().int().min(1).max(6).describe("The result of the second die roll (1-6)."),
  botComment: z.string().optional().describe("An optional comment from the bot about its roll or strategy."),
});
export type AIDiceRollOutput = z.infer<typeof AIDiceRollOutputSchema>;

export async function aiDiceRollSimulation(input: AIDiceRollInput): Promise<AIDiceRollOutput> {
  return aiDiceRollSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDiceRollSimulationPrompt',
  input: { schema: AIDiceRollInputSchema },
  output: { schema: AIDiceRollOutputSchema },
  prompt: `You are an intelligent AI bot playing 'Tosh tashlash' (a dice rolling game) against a human player.
Your objective is to win the game by making strategic dice rolls. Based on the current game state, simulate rolling two six-sided dice.

Here is the current game context:
Player's Current Score: {{{playerScore}}}
Bot's Current Score: {{{botScore}}}
{{#if playerLastRoll}}
Player's Last Roll: {{{playerLastRoll.[0]}}} and {{{playerLastRoll.[1]}}}
{{/if}}
{{#if gamePhase}}
Game Phase: {{{gamePhase}}}
{{/if}}

Simulate your two dice rolls (each between 1 and 6). Provide your roll results for 'dice1' and 'dice2', and optionally a brief 'botComment' explaining your strategy or reaction to the game state. Ensure your dice rolls are random but reflect a strategic intelligence based on the scores.
`,
});

const aiDiceRollSimulationFlow = ai.defineFlow(
  {
    name: 'aiDiceRollSimulationFlow',
    inputSchema: AIDiceRollInputSchema,
    outputSchema: AIDiceRollOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get dice roll simulation from the AI.');
    }
    return output;
  }
);
