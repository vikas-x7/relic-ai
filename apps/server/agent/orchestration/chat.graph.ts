import { END, START, StateGraph } from '@langchain/langgraph';
import { analyzeSourcesNode } from '../nodes/analyze-sources.node';
import { generateAnswerNode } from '../nodes/generate-answer.node';
import { searchNode } from '../nodes/search.node';
import { understandQueryNode } from '../nodes/understand-query.node';
import { validateCitationsNode } from '../nodes/validate-citations.node';
import { ChatState } from '../state/chat.state';

export interface ChatGraphInput {
  conversationId: number;
  userId: number;
  history: ChatState['history'];
  currentQuery: string;
}

export interface ChatGraphOutput {
  answer: string;
  webUsed: boolean;
  sources: ChatState['sources'];
  citations: ChatState['citations'];
}

let cachedGraph: ReturnType<typeof buildChatGraph> | null = null;

function buildChatGraph() {
  const workflow = new StateGraph(ChatState)
    .addNode('understand-query', understandQueryNode)
    .addNode('search', searchNode)
    .addNode('analyze-sources', analyzeSourcesNode)
    .addNode('generate-answer', generateAnswerNode)
    .addNode('validate-citations', validateCitationsNode)
    .addEdge(START, 'understand-query')
    .addConditionalEdges('understand-query', (state: ChatState) =>
      state.needsWebSearch ? 'search' : 'generate-answer',
    )
    .addEdge('search', 'analyze-sources')
    .addEdge('analyze-sources', 'generate-answer')
    .addConditionalEdges('generate-answer', (state: ChatState) =>
      state.webUsed && state.sources.length > 0 ? 'validate-citations' : END,
    )
    .addEdge('validate-citations', END);

  return workflow.compile();
}

export function getChatGraph() {
  if (!cachedGraph) {
    cachedGraph = buildChatGraph();
  }
  return cachedGraph;
}

export async function runChatGraph(input: ChatGraphInput): Promise<ChatGraphOutput> {
  const result = await getChatGraph().invoke(input);
  return {
    answer: result.answer,
    webUsed: result.webUsed,
    sources: result.sources,
    citations: result.citations,
  };
}
