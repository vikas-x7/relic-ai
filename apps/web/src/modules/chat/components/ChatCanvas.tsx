'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  useStore,
  type Node,
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
import { saveCanvasApi } from '@/src/modules/chat/api/conversations';
import {
  getConversationDetail,
  type ConversationDetail,
} from '@/src/modules/chat/api/conversationDetail';
import { initialNodes } from '@/src/modules/chat/constants';
import type { ChatNodeType, ChatNodeData, PersistedCanvas } from '@/src/modules/chat/types';

const nodeTypes = { chatNode: ChatNode };

const defaultEdgeOptions = { type: 'floating', animated: true };

function serializeCanvas(nodes: Node<ChatNodeData>[], edges: Edge[]): PersistedCanvas {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        customId: node.data.customId,
        initialInput: node.data.initialInput,
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target,
      targetHandle: edge.targetHandle,
      type: edge.type,
      animated: edge.animated,
    })),
  };
}

function isPersistedCanvas(value: unknown): value is PersistedCanvas {
  if (!value || typeof value !== 'object') return false;
  const canvas = value as PersistedCanvas;
  return Array.isArray(canvas.nodes) && Array.isArray(canvas.edges);
}

type ChatCanvasInnerProps = {
  conversationId: string | null;
};

function ChatCanvasInner({ conversationId }: ChatCanvasInnerProps) {
  const router = useRouter();
  const { zoomIn, zoomOut, setCenter, getZoom } = useReactFlow();
  const zoomPercent = useStore((state) => Math.round(state.transform[2] * 100));

  const loadedConversationIdRef = useRef<string | null>(null);
  const lastSavedCanvasRef = useRef<string | null>(null);

  const handleConversationCreated = useCallback(
    (id: string) => {
      router.replace(`/chat/${id}`);
    },
    [router],
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
    onConversationCreated: handleConversationCreated,
  });

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      onNodeClick(node.id);
    },
    [onNodeClick],
  );

  // Load conversation when conversationId changes
  useEffect(() => {
    if (!conversationId || loadedConversationIdRef.current === conversationId) return;

    let cancelled = false;

    void (async () => {
      try {
        const detail: ConversationDetail = await getConversationDetail(conversationId);
        if (cancelled) return;

        // Group messages by nodeId
        const messagesByNode: Record<string, (typeof nodeMessages)[string]> = {};
        for (const msg of detail.messages) {
          if (msg.role !== 'user' && msg.role !== 'assistant') continue;
          if (!messagesByNode[msg.nodeId]) messagesByNode[msg.nodeId] = [];
          messagesByNode[msg.nodeId].push({
            id: String(msg.id),
            role: msg.role as 'user' | 'assistant',
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
        setHasInteracted(Object.keys(messagesByNode).length > 0);
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
      } catch (error) {
        console.error('[chat] failed to load conversation:', error);
        setNodeMessages({});
        setNodes(syncNodeInteractionHandler(initialNodes, {}, new Set()));
        setEdges([]);
        loadedConversationIdRef.current = conversationId;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    conversationId,
    setNodes,
    setEdges,
    setNodeMessages,
    setHasInteracted,
    syncNodeInteractionHandler,
    setCenter,
    getZoom,
  ]);

  // Reset loaded ref when conversation changes to null
  useEffect(() => {
    if (!conversationId) {
      loadedConversationIdRef.current = null;
    }
  }, [conversationId]);

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
      <WelcomeOverlay visible={hasInteracted} />

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
