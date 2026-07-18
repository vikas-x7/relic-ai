import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { searchWeb } from '../search/search.service';

export const webSearchTool = tool(async ({ query }) => JSON.stringify(await searchWeb(query, 5)), {
  name: 'web_search',
  description:
    'Searches the public web for fresh information. Returns a JSON array of results with title, url, content and domain.',
  schema: z.object({
    query: z.string().min(1).describe('The web search query'),
  }),
});
