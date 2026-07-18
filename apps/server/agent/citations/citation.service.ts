import { getPrisma } from 'db';
import type { AnswerCitation } from './citation.types';

export async function saveMessageCitations(
  messageId: number,
  citations: AnswerCitation[],
): Promise<number> {
  if (!citations.length) return 0;

  const prisma = getPrisma();
  for (const citation of citations) {
    const source = await prisma.source.upsert({
      where: { url: citation.url },
      create: { url: citation.url, title: citation.title },
      update: {},
    });
    await prisma.messageCitation.create({
      data: {
        messageId,
        sourceId: source.id,
        citationIndex: citation.citationIndex,
      },
    });
  }
  return citations.length;
}
