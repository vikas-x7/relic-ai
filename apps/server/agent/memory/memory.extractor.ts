import { z } from 'zod';
import { getChatModel } from '../models/model.provider';
import { MEMORY_EXTRACTION_PROMPT } from '../prompts/memory-extraction.prompt';
import type { MemoryExtractionResult } from './memory.types';

const extractionSchema = z.object({
  shouldRemember: z.boolean(),
  memories: z
    .array(
      z.object({
        content: z.string().min(1).max(500),
        type: z.enum(['FACT', 'PREFERENCE', 'CONTEXT']),
        importance: z.number().int().min(1).max(5),
      }),
    )
    .max(3),
});

function parseJsonBlock(text: string): unknown | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function extractMemoriesFromExchange(
  userMessage: string,
  assistantReply: string,
): Promise<MemoryExtractionResult> {
  const nothingToRemember: MemoryExtractionResult = { shouldRemember: false, memories: [] };

  try {
    const prompt = MEMORY_EXTRACTION_PROMPT.replace('{{userMessage}}', userMessage).replace(
      '{{assistantReply}}',
      assistantReply,
    );

    const response = await getChatModel().invoke(prompt);
    const parsed = extractionSchema.safeParse(parseJsonBlock(String(response.content)));

    if (!parsed.success || !parsed.data.shouldRemember) {
      return nothingToRemember;
    }

    return {
      shouldRemember: true,
      memories: parsed.data.memories,
    };
  } catch (error) {
    console.error('[memory] extraction failed:', error);
    return nothingToRemember;
  }
}
