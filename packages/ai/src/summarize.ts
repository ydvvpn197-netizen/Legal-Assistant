// Simple frequency-based extractive summarizer. Language-agnostic.
export function summarize(text: string, maxSentences = 5): string {
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  if (sentences.length <= maxSentences) return text.trim();
  const words = text.toLowerCase().match(/\b[\p{L}\p{N}]{3,}\b/gu) || [];
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const scores = sentences.map((s) => {
    const ws = s.toLowerCase().match(/\b[\p{L}\p{N}]{3,}\b/gu) || [];
    const score = ws.reduce((acc, w) => acc + (freq.get(w) || 0), 0) / (ws.length || 1);
    return { s, score };
  });
  const top = scores.sort((a, b) => b.score - a.score).slice(0, maxSentences).map((x) => x.s);
  // Preserve original order
  const ordered = sentences.filter((s) => top.includes(s));
  const disclaimer = ' This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.';
  return ordered.join(' ') + disclaimer;
}
