import { DEFAULT_CHAT_ID } from '@/src/modules/chat/constants';

type StreamChatParams = {
  chatId?: string;
  nodeId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  signal: AbortSignal;
  onChunk: (content: string) => void;
};

const OFFLINE_RESPONSE = `Here's a simulated response from Relic AI while the backend is offline.

**Your message:** nothing yet.

The full canvas experience is ready:
- Create branches by dragging from a node's handle
- Select text and hit "New node" to branch from that idea
- Each node inherits the full context of its parent chain

Connect the Hono backend at \`/api/chat/stream\` to replace this mock with a real streaming model.`;

export async function streamChat({
  chatId = DEFAULT_CHAT_ID,
  nodeId,
  messages,
  signal,
  onChunk,
}: StreamChatParams): Promise<string> {
  let response: Response;

  try {
    response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, nodeId, messages }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;

    return simulateStream(OFFLINE_RESPONSE, onChunk, signal);
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error || 'AI response failed.');
  }

  if (!response.body) {
    throw new Error('AI response stream was empty.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let streamedContent = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    streamedContent += chunk;
    onChunk(streamedContent);
  }

  const trailingChunk = decoder.decode();

  if (trailingChunk) {
    streamedContent += trailingChunk;
    onChunk(streamedContent);
  }

  return streamedContent.trim() || 'No response returned from the model.';
}

async function simulateStream(
  content: string,
  onChunk: (content: string) => void,
  signal: AbortSignal,
): Promise<string> {
  for (const [index] of content.split('').entries()) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    await new Promise((resolve) => setTimeout(resolve, 3));
    onChunk(content.slice(0, index + 1));
  }

  return content;
}
