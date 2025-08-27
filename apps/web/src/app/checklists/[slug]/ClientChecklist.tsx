"use client";
import { useMemo, useState } from 'react';

export default function ClientChecklist({ items }: { items: { id: string; text: string; guidance: string }[] }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const score = useMemo(() => {
    const keys = Object.keys(answers);
    if (!keys.length) return 0;
    const yes = keys.filter((k) => answers[k]).length;
    return Math.round((yes / keys.length) * 100);
  }, [answers]);

  return (
    <div>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <label style={{ display: 'block', fontWeight: 600 }}>{i.text}</label>
            <div style={{ color: '#555' }}>{i.guidance}</div>
            <div style={{ margin: '8px 0' }}>
              <label><input type="radio" name={i.id} onChange={() => setAnswers((s) => ({ ...s, [i.id]: true }))} /> Yes</label>
              <label style={{ marginLeft: 12 }}><input type="radio" name={i.id} onChange={() => setAnswers((s) => ({ ...s, [i.id]: false }))} /> No</label>
            </div>
          </li>
        ))}
      </ol>
      <div style={{ marginTop: 12 }}>
        <strong>Compliance score:</strong> {score}%
      </div>
      <small>
        This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.
      </small>
    </div>
  );
}
