'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  type Edge,
} from '@xyflow/react';
import { useChatWorkspace } from '@/src/modules/chat/hooks/useChatWorkspace';
import ChatNode from '@/src/modules/chat/components/ChatNode';
import FullscreenChat from '@/src/modules/chat/components/FullscreenChat';
import CanvasToolbar from '@/src/modules/chat/components/CanvasToolbar';
import NodesSidebar from '@/src/modules/chat/components/NodesSidebar';
import DeleteConfirmModal from '@/src/modules/chat/components/DeleteConfirmModal';
import WelcomeOverlay from '@/src/modules/chat/components/WelcomeOverlay';
import TextSelectionButton from '@/src/modules/chat/components/TextSelectionButton';
import CreditsBadge from '@/src/modules/chat/components/CreditsBadge';
import { saveCanvasApi } from '@/src/modules/chat/api/conversations';
import { useConversationDetail } from '@/src/modules/chat/hooks/useConversations';
import { initialNodes } from '@/src/modules/chat/constants';
import { serializeCanvas, isPersistedCanvas } from '@/src/modules/chat/utils/canvas';
import type { ChatNodeType } from '@/src/modules/chat/types';

const nodeTypes = { chatNode: ChatNode };

const defaultEdgeOptions = { type: 'floating', animated: true };

type ChatCanvasProps = {
  conversationId: string | null;
  onConversationCreated?: (id: string) => void;
};

function ChatCanvasInner({ conversationId, onConversationCreated }: ChatCanvasProps) {
  const { zoomIn, zoomOut, setCenter, getZoom } = useReactFlow();

  const loadedConversationIdRef = useRef<string | null>(null);
  const lastSavedCanvasRef = useRef<string | null>(null);
  const freshConvRef = useRef<string | null>(null);
  const [freshConvId, setFreshConvId] = useState<string | null>(null);

  const { data: detail, isLoading } = useConversationDetail(conversationId);

  // Freshly created conversations already render their (locally added) messages,
  // so we never blank the canvas or show a loading overlay for them.
  const isFreshCreated = freshConvId === conversationId;
  // Only show loading while the detail for the current conversation is actually
  // being fetched. Returning to an already-cached chat shows instantly (no blink).
  const isCanvasLoading = Boolean(conversationId && !isFreshCreated && isLoading);

  const handleCreated = useCallback(
    (createdId: string) => {
      freshConvRef.current = createdId;
      loadedConversationIdRef.current = createdId;
      setFreshConvId(createdId);
      onConversationCreated?.(createdId);
    },
    [onConversationCreated],
  );

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnectEnd,
    onPaneClick,
    onNodeClick,
    onNodeDragStart,
    onMoveStart,
    activeNodeId,
    hasInteracted,
    setHasInteracted,
    expandedNodeId,
    nodeToDelete,
    isNodesPanelOpen,
    setIsNodesPanelOpen,
    handleCloseFullscreen,
    nodeMessages,
    setNodeMessages,
    streamingNodeIds,
    nodeOperations,
    textSelectionAction,
    handleCreateNodeFromSelection,
    handleSend,
    handleStop,
    cancelDeleteNode,
    syncNodeInteractionHandler,
  } = useChatWorkspace({
    activeConversationId: conversationId,
    onConversationCreated: handleCreated,
  });

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      onNodeClick(node.id);
    },
    [onNodeClick],
  );

  // Load conversation when detail or conversationId changes
  useEffect(() => {
    if (!conversationId) {
      loadedConversationIdRef.current = null;
      lastSavedCanvasRef.current = null;
      freshConvRef.current = null;
      setNodeMessages({});
      setHasInteracted(false);
      setNodes(syncNodeInteractionHandler(initialNodes, {}, new Set()));
      setEdges([]);
      return;
    }

    // Navigating to a different (existing) conversation clears the in-session flag
    if (freshConvRef.current && freshConvRef.current !== conversationId) {
      freshConvRef.current = null;
    }

    // Hide welcome overlay immediately when switching to an existing chat
    setHasInteracted(true);

    // Already restored for this conversation
    if (loadedConversationIdRef.current === conversationId) return;

    // Detail not ready yet (fetching from server): clear the previous conversation's
    // canvas so nothing stale/mixed shows. The loading overlay covers the screen
    // while this happens, so no default input nodes flicker through.
    if (!detail) {
      setNodeMessages({});
      setNodes([]);
      setEdges([]);
      return;
    }

    // Detail is available (fresh fetch or cached) -> restore this conversation
    const messagesByNode: Record<string, (typeof nodeMessages)[string]> = {};
    for (const msg of detail.messages) {
      const role = msg.role?.toLowerCase();
      if (role !== 'user' && role !== 'assistant') continue;
      if (!messagesByNode[msg.nodeId]) messagesByNode[msg.nodeId] = [];
      messagesByNode[msg.nodeId].push({
        id: String(msg.id),
        role: role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // Restore canvas from persisted data
    const savedCanvas = isPersistedCanvas(detail.canvas) ? detail.canvas : null;
    const nextNodes = savedCanvas?.nodes.length
      ? savedCanvas.nodes.map((node): ChatNodeType => ({
          id: node.id,
          type: (node.type || 'chatNode') as string,
          position: node.position,
          data: {
            customId: node.data?.customId || node.id,
            initialInput: node.data?.initialInput,
          },
        }))
      : initialNodes;
    const nextEdges: Edge[] = savedCanvas?.edges.length ? savedCanvas.edges : [];

    setNodeMessages(messagesByNode);
    setNodes(syncNodeInteractionHandler(nextNodes, messagesByNode, new Set()));
    setEdges(nextEdges);
    loadedConversationIdRef.current = conversationId;
    lastSavedCanvasRef.current = JSON.stringify(serializeCanvas(nextNodes, nextEdges));

    // Center viewport on restored nodes
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (nextNodes.length > 0) {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          nextNodes.forEach((n) => {
            minX = Math.min(minX, n.position.x);
            minY = Math.min(minY, n.position.y);
            maxX = Math.max(maxX, n.position.x + 750);
            maxY = Math.max(maxY, n.position.y + 200);
          });
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          setCenter(centerX, centerY, { duration: 800, zoom: getZoom() });
        }
      });
    }, 100);
  }, [
    conversationId,
    detail,
    setNodes,
    setEdges,
    setNodeMessages,
    setHasInteracted,
    syncNodeInteractionHandler,
    setCenter,
    getZoom,
  ]);

  // Debounced auto-save of canvas state
  useEffect(() => {
    if (!conversationId || isCanvasLoading) return;
    if (loadedConversationIdRef.current !== conversationId) return;

    const canvas = serializeCanvas(nodes, edges);
    const signature = JSON.stringify(canvas);

    if (lastSavedCanvasRef.current === signature) return;

    const timeout = window.setTimeout(() => {
      lastSavedCanvasRef.current = signature;
      void saveCanvasApi(conversationId, canvas).catch((err) => {
        console.error('[chat] failed to save canvas:', err);
      });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [conversationId, nodes, edges, isCanvasLoading]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#000000]">
      {isCanvasLoading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#0099FF]" />
          </div>
        </div>
      )}

      {!conversationId && <WelcomeOverlay visible={hasInteracted} />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectEnd={onConnectEnd}
        onPaneClick={onPaneClick}
        onNodeDragStart={onNodeDragStart}
        onMoveStart={onMoveStart}
        isValidConnection={() => false}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        connectOnClick={false}
        autoPanOnConnect
        autoPanSpeed={20}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.01}
        maxZoom={100}
        fitViewOptions={{ maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1.5} color="#212121" />
        <MiniMap
          style={{ width: 120, height: 80, position: 'fixed', background: '#000' }}
          className="overflow-hidden rounded-md border border-[#222]"
          pannable
          zoomable
          nodeColor={() => '#555'}
          nodeStrokeColor={() => '#999'}
          nodeBorderRadius={2}
          bgColor="#000"
          maskColor="rgba(255,255,255,0.05)"
        />
      </ReactFlow>

      <CreditsBadge />

      <CanvasToolbar
        onZoomOut={() => void zoomOut({ duration: 180 })}
        onZoomIn={() => void zoomIn({ duration: 180 })}
        onArrangeNodes={nodeOperations.handleArrangeNodes}
        onFocusActiveNode={nodeOperations.handleFocusActiveNode}
        isSidebarOpen={isNodesPanelOpen}
        onToggleSidebar={() => setIsNodesPanelOpen((p) => !p)}
        arrangeDisabled={nodes.length <= 1}
        focusDisabled={nodes.length === 0}
      />

      <NodesSidebar
        isOpen={isNodesPanelOpen}
        nodes={nodes}
        nodeMessages={nodeMessages}
        activeNodeId={activeNodeId}
        onClose={() => setIsNodesPanelOpen(false)}
        onSelectNode={(nodeId) => onNodeClick(nodeId)}
      />

      {expandedNodeId && (
        <FullscreenChat
          nodeId={expandedNodeId}
          messages={nodeMessages[expandedNodeId] || []}
          isStreaming={streamingNodeIds.has(expandedNodeId)}
          onSend={handleSend}
          onStop={handleStop}
          onClose={handleCloseFullscreen}
          onRequestDelete={(id) => {
            handleCloseFullscreen();
            nodeOperations.handleDeleteNode(id);
          }}
          canDelete={nodes.length > 1}
        />
      )}

      {textSelectionAction && (
        <TextSelectionButton
          x={textSelectionAction.x}
          y={textSelectionAction.y}
          onClick={handleCreateNodeFromSelection}
        />
      )}

      {nodeToDelete && (
        <DeleteConfirmModal
          onCancel={cancelDeleteNode}
          onConfirm={nodeOperations.confirmDeleteNode}
        />
      )}
    </div>
  );
}

type OuterChatCanvasProps = {
  conversationId: string | null;
  onConversationCreated?: (id: string) => void;
};

export default function ChatCanvas({
  conversationId,
  onConversationCreated,
}: OuterChatCanvasProps) {
  return (
    <ReactFlowProvider>
      <ChatCanvasInner
        conversationId={conversationId}
        onConversationCreated={onConversationCreated}
      />
    </ReactFlowProvider>
  );
}
