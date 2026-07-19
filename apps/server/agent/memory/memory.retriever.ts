import { getPrisma } from 'db';
import type { MemoryItem } from './memory.types';

const MAX_RETRIEVED_MEMORIES = 20;

export async function getRelevantMemories(
  userId: number,
  limit: number = MAX_RETRIEVED_MEMORIES,
): Promise<MemoryItem[]> {
  const prisma = getPrisma();
  const rows = await prisma.memory.findMany({
    where: { userId },
    orderBy: [{ importance: 'desc' }, { updatedAt: 'desc' }],
    take: limit,
  });

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    type: row.type,
    importance: row.importance,
  }));
}
