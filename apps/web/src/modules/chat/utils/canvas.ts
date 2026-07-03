import type { Edge } from '@xyflow/react';
import {
  CHAT_NODE_WIDTH,
  STREAM_MAX_REVEAL_RATE,
  STREAM_MIN_REVEAL_RATE,
} from '@/src/modules/chat/constants';
import type {
  ChatMessage,
  ChatNodeType,
  PersistedCanvas,
} from '@/src/modules/chat/types';

/**
 * Walk the edge graph backwards from `nodeId` to collect an ordered list of
 * ancestor node IDs (root-first). This lets a child node inherit the full
 * conversation context from its parent chain.
 */
export function getAncestorChain(nodeId: string, edgeList: Edge[]): string[] {
  const ancestors: string[] = [];
  const visited = new Set<string>();
  let current = nodeId;

  while (true) {
    if (visited.has(current)) break;
    visited.add(current);

    const incomingEdge = edgeList.find((edge) => edge.target === current);
    if (!incomingEdge) break;

    ancestors.unshift(incomingEdge.source);
    current = incomingEdge.source;
  }

  return ancestors;
}

export function getStreamRevealRate(remainingCharacters: number) {
  if (remainingCharacters > 700) return STREAM_MAX_REVEAL_RATE;
  if (remainingCharacters > 250) return 360;
  if (remainingCharacters > 80) return 220;

  return STREAM_MIN_REVEAL_RATE;
}

export function serializeCanvas(
  nodes: ChatNodeType[],
  edges: Edge[],
): PersistedCanvas {
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

export function isPersistedCanvas(value: unknown): value is PersistedCanvas {
  if (!value || typeof value !== 'object') return false;

  const canvas = value as PersistedCanvas;

  return Array.isArray(canvas.nodes) && Array.isArray(canvas.edges);
}

export function getNodeTitle(
  node: ChatNodeType,
  messages: ChatMessage[],
  index: number,
) {
  const full =
    messages.find((message) => message.role === 'user')?.content ||
    node.data.initialInput ||
    `Node ${index + 1}`;

  return full.length > 35 ? `${full.slice(0, 35).trim()}...` : full;
}

export function getCanvasBounds(nodes: ChatNodeType[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + CHAT_NODE_WIDTH);
    maxY = Math.max(maxY, node.position.y + 200);
  });

  return {
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}
