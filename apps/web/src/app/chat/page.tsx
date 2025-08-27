"use client";
import { useState } from 'react';

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer(null);
    setCitations([]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setAnswer(data.answer);
      setCitations(data.citations || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Chat</h2>
      <form onSubmit={onAsk} style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about Indian law (EN/HI)"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading || query.trim().length < 3}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {answer && (
        <div style={{ marginTop: 16 }}>
          <h3>Answer</h3>
          <p>{answer}</p>
          {!!citations.length && (
            <div>
              <h4>Citations</h4>
              <ul>
                {citations.map((c, idx) => (
                  <li key={idx}>
                    <em>{c.source}</em>: {c.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
