export type RetrievalResult = { text: string; source: string; score?: number };
import { getPrismaClient } from '@legalassistant/db';
import { embed, cosineSim } from './embeddings';
export { embed, cosineSim } from './embeddings';

export async function retrieveRelevant(query: string, language: 'en' | 'hi' = 'en'): Promise<RetrievalResult[]> {
  const prisma = getPrismaClient();
  const qv = embed(query);
  const chunks = await prisma.ragChunk.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { source: true }
  });
  const scored = chunks
    .filter((c) => c.source.language === language)
    .map((c) => {
      const score = cosineSim(qv, c.embedding as unknown as number[]);
      return { text: c.text, source: c.source.title, score } as RetrievalResult;
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);
  return scored;
}

export async function answerWithCitations(query: string, language: 'en' | 'hi' = 'en') {
  const hits = await retrieveRelevant(query, language);
  const base = hits.length
    ? `Here is general information related to your query: ${hits.map((h) => h.text).join(' ')}`
    : `I can provide general legal information. Please share more specifics.`;
  const disclaimer = ' This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.';
  return { answer: base + disclaimer, citations: hits };
}
export { summarize } from './summarize';
