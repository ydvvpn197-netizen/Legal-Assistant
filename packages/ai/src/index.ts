export type RetrievalResult = {
  text: string;
  source: string;
};

const seedCorpus: RetrievalResult[] = [
  {
    text: 'Under the Indian Contract Act, 1872, a contract requires offer, acceptance, lawful consideration and free consent.',
    source: 'Indian Contract Act, 1872'
  },
  {
    text: 'GST registration is mandatory if annual aggregate turnover exceeds the threshold prescribed by law.',
    source: 'GST Act and Rules'
  }
];

export async function retrieveRelevant(query: string): Promise<RetrievalResult[]> {
  const q = query.toLowerCase();
  return seedCorpus.filter((r) => r.text.toLowerCase().includes(q)).slice(0, 3);
}

export async function answerWithCitations(query: string): Promise<{ answer: string; citations: RetrievalResult[] }> {
  const hits = await retrieveRelevant(query);
  const base = hits.length
    ? `Here is general information related to your query: ${hits.map((h) => h.text).join(' ')}`
    : `I can provide general legal information. Please share more specifics.`;
  const disclaimer = ' This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.';
  return { answer: base + disclaimer, citations: hits };
}
