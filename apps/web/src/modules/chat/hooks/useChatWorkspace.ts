import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactFlow, type Edge } from '@xyflow/react';
import { useChatStream } from '@/src/modules/chat/hooks/useChatStream';
import { useCanvasState, type NodeHandlers } from '@/src/modules/chat/hooks/useCanvasState';
import { useCanvasConnections } from '@/src/modules/chat/hooks/useCanvasConnections';
import { useNodeOperations } from '@/src/modules/chat/hooks/useNodeOperations';
import { useTextSelection, type CanvasOpsRef } from '@/src/modules/chat/hooks/useTextSelection';

type UseChatWorkspaceParams = {
  activeConversationId: string | null;
  onConversationCreated?: (id: string) => void;
};

export function useChatWorkspace({
  activeConversationId,
  onConversationCreated,
}: UseChatWorkspaceParams) {
  const reactFlow = useReactFlow();
  const { fitView, getNode, getZoom, setCenter, screenToFlowPosition } = reactFlow;

  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState('root');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [isNodesPanelOpen, setIsNodesPanelOpen] = useState(false);

  const handlersRef = useRef<NodeHandlers>({});
  const opsRef = useRef<CanvasOpsRef | null>(null);
  const edgesGetterRef = useRef<() => Edge[]>(() => []);

  const handleUserInteraction = useCallback(() => setHasInteracted(true), []);
  const handleNodeFocus = useCallback((nodeId: string) => setActiveNodeId(nodeId), []);
  const handleResponseHeightChange = useCallback(() => {}, []);

  const handleExpand = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
    setExpandedNodeId(nodeId);
  }, []);

  const handleCloseFullscreen = useCallback(() => setExpandedNodeId(null), []);

  const chatStream = useChatStream({
    getEdges: () => edgesGetterRef.current(),
    onActivateNode: handleNodeFocus,
    activeConversationId,
    onConversationCreated,
  });

  const canvasState = useCanvasState({
    handlersRef,
    nodeMessages: chatStream.nodeMessages,
    streamingNodeIds: chatStream.streamingNodeIds,
  });

  const nodeOperations = useNodeOperations({
    nodes: canvasState.nodes,
    activeNodeId,
    nodeToDelete,
    setActiveNodeId,
    setNodeToDelete,
    setNodesRef: canvasState.setNodesRef,
    setEdgesRef: canvasState.setEdgesRef,
    fitView: fitView as (...args: unknown[]) => Promise<boolean>,
    getNode: getNode as (nodeId: string) => import('@xyflow/react').Node | undefined,
    setCenter: setCenter as (...args: unknown[]) => Promise<boolean>,
  });

  const textSelection = useTextSelection({
    opsRef,
    handlersRef,
    onActivateNode: handleNodeFocus,
    onInteract: handleUserInteraction,
  });

  const handlers: NodeHandlers = {
    onSend: chatStream.handleSend,
    onStop: chatStream.handleStop,
    onExpand: handleExpand,
    onRequestDelete: nodeOperations.handleDeleteNode,
    onFocusNode: handleNodeFocus,
    onInteract: handleUserInteraction,
    onTextSelection: textSelection.handleTextSelection,
    onResponseHeightChange: handleResponseHeightChange,
  };

  const ops: CanvasOpsRef = {
    setNodes: canvasState.setNodes,
    setEdges: canvasState.setEdges,
    getNode: getNode as (nodeId: string) => import('@xyflow/react').Node | undefined,
    getZoom,
    screenToFlowPosition,
    setCenter: setCenter as (...args: unknown[]) => Promise<boolean>,
  };

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    opsRef.current = ops;
  });

  useEffect(() => {
    edgesGetterRef.current = () => canvasState.edgesRef.current;
  });

  const connections = useCanvasConnections({
    handlers,
    ops,
    onActivateNode: handleNodeFocus,
    onInteract: handleUserInteraction,
  });

  return {
    nodes: canvasState.nodes,
    edges: canvasState.edges,
    setNodes: canvasState.setNodes,
    setEdges: canvasState.setEdges,
    onNodesChange: canvasState.onNodesChange,
    onEdgesChange: canvasState.onEdgesChange,
    onConnectEnd: connections.onConnectEnd,
    onPaneClick: handleUserInteraction,
    onNodeClick: (nodeId: string) => {
      handleNodeFocus(nodeId);
      handleUserInteraction();
    },
    onNodeDragStart: handleUserInteraction,
    onMoveStart: handleUserInteraction,
    activeNodeId,
    hasInteracted,
    setHasInteracted,
    expandedNodeId,
    nodeToDelete,
    isNodesPanelOpen,
    setIsNodesPanelOpen,
    handleCloseFullscreen,
    nodeMessages: chatStream.nodeMessages,
    setNodeMessages: chatStream.setNodeMessages,
    streamingNodeIds: chatStream.streamingNodeIds,
    nodeOperations,
    textSelectionAction: textSelection.textSelectionAction,
    handleCreateNodeFromSelection: textSelection.handleCreateNodeFromSelection,
    setTextSelectionAction: textSelection.setTextSelectionAction,
    handleSend: chatStream.handleSend,
    handleStop: chatStream.handleStop,
    cancelDeleteNode: () => setNodeToDelete(null),
    syncNodeInteractionHandler: canvasState.syncNodeInteractionHandler,
  };
}

export type ChatWorkspace = ReturnType<typeof useChatWorkspace>;
