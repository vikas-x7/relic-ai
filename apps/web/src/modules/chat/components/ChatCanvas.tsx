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
  useStore,
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
import {
  getConversationDetail,
  type ConversationDetail,
} from '@/src/modules/chat/api/conversationDetail';
import { useConversationDetail } from '@/src/modules/chat/hooks/useConversations';
import { initialNodes } from '@/src/modules/chat/constants';
import { serializeCanvas, isPersistedCanvas } from '@/src/modules/chat/utils/canvas';
import type { ChatNodeType } from '@/src/modules/chat/types';

const nodeTypes = { chatNode: ChatNode };

const defaultEdgeOptions = { type: 'floating', animated: true };

type ChatCanvasInnerProps = {
  conversationId: string | null;
};

function ChatCanvasInner({ conversationId }: ChatCanvasInnerProps) {
  const { zoomIn, zoomOut, setCenter, getZoom } = useReactFlow();
  const zoomPercent = useStore((state) => Math.round(state.transform[2] * 100));

  const loadedConversationIdRef = useRef<string | null>(null);
  const lastSavedCanvasRef = useRef<string | null>(null);

  const { data: detail, isLoading } = useConversationDetail(conversationId);

  const isCanvasLoading = Boolean(
    conversationId && (isLoading || loadedConversationIdRef.current !== conversationId),
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
      setNodeMessages({});
      setHasInteracted(false);
      setNodes(syncNodeInteractionHandler(initialNodes, {}, new Set()));
      setEdges([]);
      return;
    }

    // Hide welcome overlay immediately when switching to an existing chat
    setHasInteracted(true);

    if (!detail || loadedConversationIdRef.current === conversationId) return;

    // Group messages by nodeId
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
    if (!conversationId || loadedConversationIdRef.current !== conversationId) return;

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
  }, [conversationId, nodes, edges]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#000000]">
      {isCanvasLoading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#000000]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        </div>
      )}

      <WelcomeOverlay visible={hasInteracted} />

      <ReactFlow
        nodes={isCanvasLoading ? [] : nodes}
        edges={isCanvasLoading ? [] : edges}
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

type ChatCanvasProps = {
  conversationId: string | null;
};

export default function ChatCanvas({ conversationId }: ChatCanvasProps) {
  return (
    <ReactFlowProvider>
      <ChatCanvasInner conversationId={conversationId} />
    </ReactFlowProvider>
  );
}
