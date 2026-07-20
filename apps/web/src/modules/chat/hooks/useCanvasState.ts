import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { applyNodeChanges, useEdgesState, type Edge, type NodeChange } from '@xyflow/react';
import { initialNodes } from '@/src/modules/chat/constants';
import type { ChatNodeType, NodeMessageMap } from '@/src/modules/chat/types';

export type NodeHandlers = {
  onSend?: (nodeId: string, message: string) => void;
  onStop?: (nodeId: string) => void;
  onExpand?: (nodeId: string) => void;
  onRequestDelete?: (nodeId: string) => void;
  onFocusNode?: (nodeId: string) => void;
  onInteract?: () => void;
  onTextSelection?: (nodeId: string, selectedText: string, selectionRect: DOMRect) => void;
  onResponseHeightChange?: (nodeId: string, delta: number) => void;
};

type UseCanvasStateParams = {
  handlersRef: React.MutableRefObject<NodeHandlers>;
  nodeMessages: NodeMessageMap;
  streamingNodeIds: Set<string>;
};

export function useCanvasState({
  handlersRef,
  nodeMessages,
  streamingNodeIds,
}: UseCanvasStateParams) {
  const [nodes, setNodes] = useState<ChatNodeType[]>(() => initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const edgesRef = useRef<Edge[]>([]);
  const setNodesRef = useRef<Dispatch<SetStateAction<ChatNodeType[]>> | null>(null);
  const setEdgesRef = useRef<Dispatch<SetStateAction<Edge[]>> | null>(null);
  const prevMsgsRef = useRef<NodeMessageMap>(nodeMessages);
  const prevStreamRef = useRef<Set<string>>(streamingNodeIds);

  const syncNodeInteractionHandler = useMemo(
    () => (nextNodes: ChatNodeType[], msgs: NodeMessageMap, currentStreamingIds: Set<string>) => {
      const handlers = handlersRef.current;

      return nextNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          messages: msgs[node.data.customId] || [],
          isStreaming: currentStreamingIds.has(node.data.customId),
          onInteract: handlers.onInteract,
          onResponseHeightChange: handlers.onResponseHeightChange,
          onSend: handlers.onSend,
          onStop: handlers.onStop,
          onExpand: handlers.onExpand,
          onFocusNode: handlers.onFocusNode,
          onRequestDelete: handlers.onRequestDelete,
          canDelete: nextNodes.length > 1,
          onTextSelection: handlers.onTextSelection,
        },
      }));
    },
    [handlersRef],
  );

  const onNodesChange = (changes: NodeChange<ChatNodeType>[]) => {
    setNodes((nds) =>
      syncNodeInteractionHandler(
        applyNodeChanges(changes, nds) as ChatNodeType[],
        nodeMessages,
        streamingNodeIds,
      ),
    );
  };

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    setNodesRef.current = setNodes;
  }, [setNodes]);

  useEffect(() => {
    setEdgesRef.current = setEdges;
  }, [setEdges]);

  const prevMsgsSignature = JSON.stringify(prevMsgsRef.current);
  const prevStreamSignature = JSON.stringify([...prevStreamRef.current]);
  const currMsgsSignature = JSON.stringify(nodeMessages);
  const currStreamSignature = JSON.stringify([...streamingNodeIds]);

  if (prevMsgsSignature !== currMsgsSignature || prevStreamSignature !== currStreamSignature) {
    prevMsgsRef.current = nodeMessages;
    prevStreamRef.current = streamingNodeIds;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNodes((nds) => syncNodeInteractionHandler(nds, nodeMessages, streamingNodeIds));
  }

  return {
    nodes,
    edges,
    edgesRef,
    setNodes,
    setEdges,
    setNodesRef,
    setEdgesRef,
    onNodesChange,
    onEdgesChange,
    syncNodeInteractionHandler,
  };
}
