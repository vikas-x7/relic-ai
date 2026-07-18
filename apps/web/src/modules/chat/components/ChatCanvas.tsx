'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  useReactFlow,
} from '@xyflow/react';
import { useChatWorkspace } from '@/src/modules/chat/hooks/useChatWorkspace';
import ChatNode from '@/src/modules/chat/components/ChatNode';
import FullscreenChat from '@/src/modules/chat/components/FullscreenChat';
import CanvasToolbar from '@/src/modules/chat/components/CanvasToolbar';
import NodesSidebar from '@/src/modules/chat/components/NodesSidebar';
import DeleteConfirmModal from '@/src/modules/chat/components/DeleteConfirmModal';
import WelcomeOverlay from '@/src/modules/chat/components/WelcomeOverlay';
import TextSelectionButton from '@/src/modules/chat/components/TextSelectionButton';

const nodeTypes = { chatNode: ChatNode };

const defaultEdgeOptions = { type: 'floating', animated: true };

function ChatCanvasInner() {
  const { zoomIn, zoomOut } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnectEnd,
    onPaneClick,
    onNodeClick,
    onNodeDragStart,
    onMoveStart,
    activeNodeId,
    hasInteracted,
    expandedNodeId,
    nodeToDelete,
    isNodesPanelOpen,
    setIsNodesPanelOpen,
    handleCloseFullscreen,
    nodeMessages,
    streamingNodeIds,
    nodeOperations,
    textSelectionAction,
    handleCreateNodeFromSelection,
    handleSend,
    handleStop,
    cancelDeleteNode,
  } = useChatWorkspace();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      onNodeClick(node.id);
    },
    [onNodeClick],
  );

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

export default function ChatCanvas() {
  return (
    <ReactFlowProvider>
      <ChatCanvasInner />
    </ReactFlowProvider>
  );
}
