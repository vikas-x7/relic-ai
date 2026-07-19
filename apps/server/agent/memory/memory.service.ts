import { getPrisma } from 'db';
import type { ExtractedMemory, MemoryItem } from './memory.types';

export async function createMemory(userId: number, data: ExtractedMemory): Promise<MemoryItem> {
  const prisma = getPrisma();
  const row = await prisma.memory.create({
    data: { userId, content: data.content, type: data.type, importance: data.importance },
  });
  return { id: row.id, content: row.content, type: row.type, importance: row.importance };
}

export async function listMemories(userId: number): Promise<MemoryItem[]> {
  const prisma = getPrisma();
  const rows = await prisma.memory.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    type: row.type,
    importance: row.importance,
  }));
}

export async function updateMemory(
  memoryId: number,
  userId: number,
  patch: Partial<Pick<ExtractedMemory, 'content' | 'type' | 'importance'>>,
) {
  const prisma = getPrisma();
  await prisma.memory.updateMany({
    where: { id: memoryId, userId },
    data: patch,
  });
}

export async function deleteMemory(memoryId: number, userId: number) {
  const prisma = getPrisma();
  await prisma.memory.deleteMany({ where: { id: memoryId, userId } });
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): Set<string> {
  return new Set(normalizeText(text).split(' ').filter(Boolean));
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

const DUPLICATE_SIMILARITY_THRESHOLD = 0.8;

export async function persistExtractedMemories(
  userId: number,
  candidates: ExtractedMemory[],
): Promise<number> {
  const prisma = getPrisma();
  const existing = await prisma.memory.findMany({ where: { userId } });
  let saved = 0;

  for (const candidate of candidates) {
    const normalized = normalizeText(candidate.content);
    const tokens = tokenize(candidate.content);

    const duplicate = existing.find((row) => {
      if (normalizeText(row.content) === normalized) return true;
      return jaccardSimilarity(tokenize(row.content), tokens) >= DUPLICATE_SIMILARITY_THRESHOLD;
    });

    if (duplicate) {
      const importance = Math.max(duplicate.importance, candidate.importance);
      await prisma.memory.update({
        where: { id: duplicate.id },
        data: { type: candidate.type, importance },
      });
      duplicate.type = candidate.type;
      duplicate.importance = importance;
      continue;
    }

    const created = await prisma.memory.create({
      data: {
        userId,
        content: candidate.content,
        type: candidate.type,
        importance: candidate.importance,
      },
    });
    existing.push(created);
    saved++;
  }

  return saved;
}
