import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { createEmbedding } from "../lib/openai-embeddings.js";
import { getPineconeIndex } from "../lib/pinecone.js";

export function listMemories(userId: string) {
  return prisma.memory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function deleteMemory(userId: string, memoryId: string) {
  return prisma.memory.deleteMany({
    where: { id: memoryId, userId },
  }).then((result) => result.count > 0);
}

export async function createMemory(userId: string, content: string, metadata?: Record<string, unknown>) {
  const embedding = await createEmbedding(content);
  const memory = await prisma.memory.create({
    data: { userId, content, metadata: metadata as Prisma.InputJsonObject | undefined },
  });

  if (embedding.length > 0) {
    const index = getPineconeIndex();
    await index.upsert([
      {
        id: memory.id,
        values: embedding,
        metadata: { userId, content, ...metadata },
      },
    ]);
  }

  return memory;
}
