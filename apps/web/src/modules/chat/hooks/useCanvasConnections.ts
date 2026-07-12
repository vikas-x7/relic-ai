import { useCallback } from 'react';
import { Position, type Edge, type FinalConnectionState, type Node } from '@xyflow/react';
import { CHAT_NODE_HANDLE_IDS, CHAT_NODE_WIDTH } from '@/src/modules/chat/constants';
import type { ChatNodeData } from '@/src/modules/chat/types';
import type { NodeHandlers } from '@/src/modules/chat/hooks/useCanvasState';

type CanvasOps = {
  setNodes: (updater: (nodes: Node<ChatNodeData>[]) => Node<ChatNodeData>[]) => void;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  screenToFlowPosition: (point: { x: number; y: number }) => { x: number; y: number };
  setCenter: (...args: unknown[]) => Promise<boolean>;
  getZoom: () => number;
};

type UseCanvasConnectionsParams = {
  handlers: NodeHandlers;
  ops: CanvasOps;
  onActivateNode: (nodeId: string) => void;
  onInteract: () => void;
};

export function useCanvasConnections({
  handlers,
  ops,
  onActivateNode,
  onInteract,
}: UseCanvasConnectionsParams) {
  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (
        connectionState.isValid ||
        !connectionState.fromNode ||
        connectionState.toNode ||
        connectionState.toHandle
      ) {
        return;
      }

      const id = crypto.randomUUID();
      const sourceNodeId = connectionState.fromNode.id;
      const sourceHandleId = connectionState.fromHandle?.id || null;

      const targetHandle =
        connectionState.fromPosition === Position.Left
          ? CHAT_NODE_HANDLE_IDS.right
          : CHAT_NODE_HANDLE_IDS.left;

      const clientX =
        event instanceof MouseEvent ? event.clientX : (event.changedTouches?.[0]?.clientX ?? 0);
      const clientY =
        event instanceof MouseEvent ? event.clientY : (event.changedTouches?.[0]?.clientY ?? 0);

      const dropPosition = ops.screenToFlowPosition({ x: clientX, y: clientY });

      let nodeX = dropPosition.x;

      if (targetHandle === CHAT_NODE_HANDLE_IDS.left) {
        nodeX = dropPosition.x - 25;
      } else {
        nodeX = dropPosition.x - CHAT_NODE_WIDTH + 25;
      }

      const newNodePosition = { x: nodeX, y: dropPosition.y - 20 };

      const newNode: Node<ChatNodeData> = {
        id,
        type: 'chatNode',
        position: newNodePosition,
        data: {
          customId: id,
          messages: [],
          onInteract,
          onResponseHeightChange: handlers.onResponseHeightChange,
          onSend: handlers.onSend,
          onExpand: handlers.onExpand,
          onRequestDelete: handlers.onRequestDelete,
        },
      };

      onInteract();
      onActivateNode(id);
      ops.setNodes((nds) => nds.concat(newNode));

      ops.setEdges((eds) =>
        eds.concat({
          id: `e-${sourceNodeId}-${id}`,
          source: sourceNodeId,
          sourceHandle: sourceHandleId,
          target: id,
          targetHandle,
          type: 'floating',
        }),
      );

      void ops.setCenter(newNodePosition.x + CHAT_NODE_WIDTH / 2, newNodePosition.y + 100, {
        duration: 350,
        ease: (t: number) => 1 - Math.pow(1 - t, 3),
        zoom: ops.getZoom(),
      });
    },
    [handlers, ops, onActivateNode, onInteract],
  );

  return { onConnectEnd };
}
