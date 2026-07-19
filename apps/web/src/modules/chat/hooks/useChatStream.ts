import { useCallback, useRef, useState } from 'react';
import { streamChat } from '@/src/modules/chat/api/chat';
import type { Edge } from '@xyflow/react';
import { getAncestorChain } from '@/src/modules/chat/utils/canvas';
import { RevealStream } from '@/src/modules/chat/utils/revealStream';
import { useRefState } from '@/src/modules/chat/hooks/useRefState';
import type { ChatMessage, NodeMessageMap } from '@/src/modules/chat/types';

type UseChatStreamParams = {
  getEdges: () => Edge[];
  onActivateNode: (nodeId: string) => void;
};

export function useChatStream({ getEdges, onActivateNode }: UseChatStreamParams) {
  const [nodeMessages, setNodeMessages, nodeMessagesRef] = useRefState<NodeMessageMap>({});
  const [streamingNodeIds, setStreamingNodeIds] = useState<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const handleStop = useCallback((nodeId: string) => {
    abortControllersRef.current.get(nodeId)?.abort();
  }, []);

  const handleSend = useCallback(
    (nodeId: string, message: string) => {
      onActivateNode(nodeId);

      abortControllersRef.current.get(nodeId)?.abort();
      abortControllersRef.current.delete(nodeId);

      const abortController = new AbortController();
      abortControllersRef.current.set(nodeId, abortController);

      const userMessage: ChatMessage = { role: 'user', content: message };
      const pendingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        status: 'pending',
      };

      const ancestorIds = getAncestorChain(nodeId, getEdges());
      const ancestorMessages = ancestorIds.flatMap((ancestorId) =>
        (nodeMessagesRef.current[ancestorId] || [])
          .filter((msg) => !msg.status)
          .map(({ role, content }) => ({ role, content })),
      );

      const conversation = [
        ...ancestorMessages,
        ...(nodeMessagesRef.current[nodeId] || []).filter((msg) => !msg.status),
        userMessage,
      ].map(({ role, content }) => ({ role, content }));

      setNodeMessages((prev) => ({
        ...prev,
        [nodeId]: [...(prev[nodeId] || []), userMessage, pendingMessage],
      }));

      setStreamingNodeIds((prev) => new Set(prev).add(nodeId));

      void (async () => {
        const reveal = new RevealStream((content) => {
          setNodeMessages((prev) => ({
            ...prev,
            [nodeId]: (prev[nodeId] || []).map((msg) =>
              msg.id === pendingMessage.id ? { ...msg, content } : msg,
            ),
          }));
        });

        const finalize = (
          content: string,
          status?: ChatMessage['status'],
          citations?: ChatMessage['citations'],
        ) => {
          setNodeMessages((prev) => ({
            ...prev,
            [nodeId]: (prev[nodeId] || []).map((msg) =>
              msg.id === pendingMessage.id ? { ...msg, content, status, citations } : msg,
            ),
          }));
        };

        try {
          const { content: finalContent, citations } = await streamChat({
            nodeId,
            messages: conversation,
            signal: abortController.signal,
            onChunk: (content) => reveal.push(content),
          });

          reveal.push(finalContent);
          await reveal.waitForDisplay();
          finalize(finalContent, undefined, citations);
        } catch (error) {
          reveal.stop();

          if (abortController.signal.aborted) {
            finalize(reveal.displayed().trim() || 'Response stopped.');
            return;
          }

          finalize(error instanceof Error ? error.message : 'AI response failed.', 'error');
        } finally {
          abortControllersRef.current.delete(nodeId);
          setStreamingNodeIds((prev) => {
            const next = new Set(prev);
            next.delete(nodeId);
            return next;
          });
        }
      })();
    },
    // nodeMessagesRef is intentionally excluded — we read it via ref to keep handleSend stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getEdges, onActivateNode, setNodeMessages],
  );

  return { nodeMessages, setNodeMessages, streamingNodeIds, handleSend, handleStop };
}
