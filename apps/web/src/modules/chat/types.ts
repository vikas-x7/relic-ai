import type { Node } from '@xyflow/react';

export type MessageRole = 'user' | 'assistant';

export type ChatMessage = {
  id?: string;
  role: MessageRole;
  content: string;
  status?: 'pending' | 'error';
};

export type ChatNodeData = {
  customId: string;
  initialInput?: string;
  messages?: ChatMessage[];
  isStreaming?: boolean;
  onInteract?: () => void;
  onResponseHeightChange?: (nodeId: string, delta: number) => void;
  onSend?: (nodeId: string, message: string) => void;
  onStop?: (nodeId: string) => void;
  onExpand?: (nodeId: string) => void;
  onFocusNode?: (nodeId: string) => void;
  onRequestDelete?: (nodeId: string) => void;
  canDelete?: boolean;
  onTextSelection?: (nodeId: string, selectedText: string, selectionRect: DOMRect) => void;
};

export type ChatNodeType = Node<ChatNodeData>;

export type TextSelectionAction = {
  sourceNodeId: string;
  text: string;
  x: number;
  y: number;
};

export type PersistedCanvasNode = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data?: {
    customId: string;
    initialInput?: string;
  };
};

export type PersistedCanvasEdge = {
  id: string;
  source: string;
  sourceHandle?: string | null;
  target: string;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
};

export type PersistedCanvas = {
  nodes: PersistedCanvasNode[];
  edges: PersistedCanvasEdge[];
};

export type ChatModel = {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  tag?: string;
};

export type NodeMessageMap = Record<string, ChatMessage[]>;
