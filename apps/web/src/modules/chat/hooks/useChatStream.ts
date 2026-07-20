import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { streamChat } from '@/src/modules/chat/api/chat';
import {
  createConversation,
  renameConversation,
  type Conversation,
} from '@/src/modules/chat/api/conversations';
import type { Edge } from '@xyflow/react';
import { getAncestorChain } from '@/src/modules/chat/utils/canvas';
import { RevealStream } from '@/src/modules/chat/utils/revealStream';
import { useRefState } from '@/src/modules/chat/hooks/useRefState';
import type { ChatMessage, NodeMessageMap } from '@/src/modules/chat/types';

type UseChatStreamParams = {
  getEdges: () => Edge[];
  onActivateNode: (nodeId: string) => void;
  activeConversationId: string | null;
  onConversationCreated?: (id: string) => void;
};

export function useChatStream({
  getEdges,
  onActivateNode,
  activeConversationId,
  onConversationCreated,
}: UseChatStreamParams) {
  const queryClient = useQueryClient();
  const [nodeMessages, setNodeMessages, nodeMessagesRef] = useRefState<NodeMessageMap>({});
  const [streamingNodeIds, setStreamingNodeIds] = useState<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const conversationIdRef = useRef(activeConversationId);
  conversationIdRef.current = activeConversationId;
  const titleSetRef = useRef(false);

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
          // Agar conversationId nahi hai to pehle create karo
          let convId = conversationIdRef.current;
          if (!convId) {
            const newConv = await createConversation(message.slice(0, 200));
            convId = newConv.id;
            conversationIdRef.current = convId;
            onConversationCreated?.(convId);
          }

          // Pehle message ke baad title set karo (agar title nahi hai)
          if (!titleSetRef.current && convId) {
            titleSetRef.current = true;
            const title = message.slice(0, 200);
            renameConversation(convId, title)
              .then((updated) => {
                queryClient.setQueryData<Conversation[]>(['conversations'], (prev) =>
                  (prev ?? []).map((c) => (c.id === updated.id ? updated : c)),
                );
              })
              .catch(() => {});
          }

          const { content: finalContent, citations } = await streamChat({
            conversationId: convId,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getEdges, onActivateNode, setNodeMessages, onConversationCreated],
  );

  return { nodeMessages, setNodeMessages, streamingNodeIds, handleSend, handleStop };
}
