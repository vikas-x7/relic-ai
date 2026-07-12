import { useCallback } from 'react';
import type { Edge, Node } from '@xyflow/react';
import {
  ARRANGE_NODE_HORIZONTAL_GAP,
  CHAT_NODE_WIDTH,
  CHAT_INPUT_FOCUS_ZOOM,
  INITIAL_NODE_ID,
} from '@/src/modules/chat/constants';
import type { ChatNodeData, ChatNodeType } from '@/src/modules/chat/types';

type UseNodeOperationsParams = {
  nodes: ChatNodeType[];
  activeNodeId: string;
  nodeToDelete: string | null;
  setActiveNodeId: React.Dispatch<React.SetStateAction<string>>;
  setNodeToDelete: (nodeId: string | null) => void;
  setNodesRef: {
    current: ((updater: (nodes: Node<ChatNodeData>[]) => Node<ChatNodeData>[]) => void) | null;
  };
  setEdgesRef: { current: ((updater: (edges: Edge[]) => Edge[]) => void) | null };
  fitView: (...args: unknown[]) => Promise<boolean>;
  getNode: (nodeId: string) => Node | undefined;
  setCenter: (...args: unknown[]) => Promise<boolean>;
};

export function useNodeOperations({
  nodes,
  activeNodeId,
  nodeToDelete,
  setActiveNodeId,
  setNodeToDelete,
  setNodesRef,
  setEdgesRef,
  fitView,
  getNode,
  setCenter,
}: UseNodeOperationsParams) {
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (nodes.length <= 1) return;
      setNodeToDelete(nodeId);
    },
    [nodes.length, setNodeToDelete],
  );

  const confirmDeleteNode = useCallback(() => {
    if (!nodeToDelete) return;

    setNodesRef.current?.((nds) => {
      if (nds.length <= 1) return nds;
      return nds.filter((node) => node.data.customId !== nodeToDelete);
    });

    setEdgesRef.current?.((eds) =>
      eds.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete),
    );

    setActiveNodeId((prev) => (prev === nodeToDelete ? INITIAL_NODE_ID : prev));
    setNodeToDelete(null);
  }, [nodeToDelete, setNodesRef, setEdgesRef, setActiveNodeId, setNodeToDelete]);

  const handleArrangeNodes = useCallback(() => {
    if (nodes.length <= 1) return;

    const firstNode = nodes[0];
    const startX = firstNode.position.x;
    const startY = firstNode.position.y;
    const horizontalGap = CHAT_NODE_WIDTH + ARRANGE_NODE_HORIZONTAL_GAP;

    setNodesRef.current?.((currentNodes) =>
      currentNodes.map((node, index) => ({
        ...node,
        position: { x: startX + index * horizontalGap, y: startY },
      })),
    );

    window.requestAnimationFrame(() => {
      void fitView({ duration: 450, padding: 0.12, maxZoom: 1 });
    });
  }, [nodes, setNodesRef, fitView]);

  const handleFocusActiveNode = useCallback(() => {
    const targetNodeId = nodes.find((node) => node.id === activeNodeId)?.id || nodes[0]?.id;
    if (!targetNodeId) return;

    const targetNode = getNode(targetNodeId) || nodes.find((node) => node.id === targetNodeId);
    const nodePosition = targetNode?.position || nodes[0]?.position;
    if (!nodePosition) return;

    const nodeWidth = targetNode?.measured?.width ?? CHAT_NODE_WIDTH;
    const nodeHeight = targetNode?.measured?.height ?? 220;
    const inputCenterX = nodePosition.x + nodeWidth / 2;
    const inputCenterY = nodePosition.y + Math.max(90, nodeHeight - 72);

    setActiveNodeId(targetNodeId);
    void setCenter(inputCenterX, inputCenterY, {
      duration: 450,
      zoom: CHAT_INPUT_FOCUS_ZOOM,
      ease: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  }, [activeNodeId, getNode, nodes, setActiveNodeId, setCenter]);

  return { handleDeleteNode, confirmDeleteNode, handleArrangeNodes, handleFocusActiveNode };
}
