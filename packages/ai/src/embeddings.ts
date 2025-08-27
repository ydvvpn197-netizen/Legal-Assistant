// Lightweight deterministic embedding for MVP: character 2-gram frequency vector
export function embed(text: string): number[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const grams = new Map<string, number>();
  for (let i = 0; i < normalized.length - 1; i++) {
    const g = normalized.slice(i, i + 2);
    grams.set(g, (grams.get(g) || 0) + 1);
  }
  const keys = Array.from(grams.keys()).sort();
  return keys.map((k) => grams.get(k) || 0);
}

export function cosineSim(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const len = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
