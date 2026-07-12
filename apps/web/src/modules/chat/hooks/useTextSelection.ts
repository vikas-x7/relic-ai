import { useCallback, useEffect, useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import {
  CHAT_NODE_HANDLE_IDS,
  CHAT_NODE_WIDTH,
  NEW_NODE_HORIZONTAL_GAP,
  NEW_NODE_VERTICAL_GAP,
} from '@/src/modules/chat/constants';
import type { ChatNodeData, TextSelectionAction } from '@/src/modules/chat/types';
import type { NodeHandlers } from '@/src/modules/chat/hooks/useCanvasState';

export type CanvasOpsRef = {
  setNodes: (updater: (nodes: Node<ChatNodeData>[]) => Node<ChatNodeData>[]) => void;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  getNode: (nodeId: string) => Node | undefined;
  getZoom: () => number;
  screenToFlowPosition: (point: { x: number; y: number }) => { x: number; y: number };
  setCenter: (...args: unknown[]) => Promise<boolean>;
};

type UseTextSelectionParams = {
  opsRef: React.MutableRefObject<CanvasOpsRef | null>;
  handlersRef: React.MutableRefObject<NodeHandlers>;
  onActivateNode: (nodeId: string) => void;
  onInteract: () => void;
};

export function useTextSelection({
  opsRef,
  handlersRef,
  onActivateNode,
  onInteract,
}: UseTextSelectionParams) {
  const [textSelectionAction, setTextSelectionAction] = useState<TextSelectionAction | null>(null);

  const handleTextSelection = useCallback(
    (nodeId: string, selectedText: string, selectionRect: DOMRect) => {
      const text = selectedText.trim();
      if (!text) {
        setTextSelectionAction(null);
        return;
      }

      onActivateNode(nodeId);
      setTextSelectionAction({
        sourceNodeId: nodeId,
        text,
        x: selectionRect.left + selectionRect.width / 2,
        y: Math.max(16, selectionRect.top - 46),
      });
    },
    [onActivateNode],
  );

  const handleCreateNodeFromSelection = useCallback(() => {
    if (!textSelectionAction) return;

    const ops = opsRef.current;
    if (!ops) return;

    const handlers = handlersRef.current;
    const id = crypto.randomUUID();
    const sourceNode = ops.getNode(textSelectionAction.sourceNodeId);
    let newNodePosition = { x: 0, y: 0 };

    if (sourceNode) {
      newNodePosition = {
        x: sourceNode.position.x + CHAT_NODE_WIDTH + NEW_NODE_HORIZONTAL_GAP,
        y: sourceNode.position.y + NEW_NODE_VERTICAL_GAP,
      };
    } else {
      const flowPos = ops.screenToFlowPosition({
        x: textSelectionAction.x,
        y: textSelectionAction.y,
      });
      newNodePosition = { x: flowPos.x - CHAT_NODE_WIDTH / 2, y: flowPos.y };
    }

    const newNode: Node<ChatNodeData> = {
      id,
      type: 'chatNode',
      position: newNodePosition,
      data: {
        customId: id,
        initialInput: textSelectionAction.text,
        messages: [],
        onInteract,
        onResponseHeightChange: handlers.onResponseHeightChange,
        onSend: handlers.onSend,
        onExpand: handlers.onExpand,
        onRequestDelete: handlers.onRequestDelete,
        onTextSelection: handleTextSelection,
      },
    };

    onInteract();
    onActivateNode(id);
    setTextSelectionAction(null);
    window.getSelection()?.removeAllRanges();

    ops.setNodes((nds) => nds.concat(newNode));
    ops.setEdges((eds) =>
      eds.concat({
        id: `e-${textSelectionAction.sourceNodeId}-${id}`,
        source: textSelectionAction.sourceNodeId,
        sourceHandle: CHAT_NODE_HANDLE_IDS.right,
        target: id,
        targetHandle: CHAT_NODE_HANDLE_IDS.left,
        type: 'floating',
      }),
    );

    void ops.setCenter(newNodePosition.x + CHAT_NODE_WIDTH / 2, newNodePosition.y + 100, {
      duration: 350,
      ease: (t: number) => 1 - Math.pow(1 - t, 3),
      zoom: ops.getZoom(),
    });
  }, [textSelectionAction, opsRef, handlersRef, onActivateNode, onInteract, handleTextSelection]);

  useEffect(() => {
    if (!textSelectionAction) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('#new-node-btn')) return;

      setTextSelectionAction(null);
      window.getSelection()?.removeAllRanges();
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [textSelectionAction]);

  return {
    textSelectionAction,
    handleTextSelection,
    handleCreateNodeFromSelection,
    setTextSelectionAction,
  };
}
