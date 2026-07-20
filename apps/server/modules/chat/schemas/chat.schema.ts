import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
});

export const renameConversationSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(8000),
  nodeId: z.string().min(1).max(200).default('root'),
});

const canvasNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z
    .object({
      customId: z.string().min(1),
      initialInput: z.string().optional(),
    })
    .optional(),
});

const canvasEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  sourceHandle: z.string().nullable().optional(),
  target: z.string().min(1),
  targetHandle: z.string().nullable().optional(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
});

export const saveCanvasSchema = z.object({
  canvas: z.object({
    nodes: z.array(canvasNodeSchema),
    edges: z.array(canvasEdgeSchema),
  }),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type RenameConversationInput = z.infer<typeof renameConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SaveCanvasInput = z.infer<typeof saveCanvasSchema>;
