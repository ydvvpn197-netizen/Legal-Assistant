"use client";
import { useState } from 'react';

export default function NdaWizard() {
  const [partyAName, setPartyAName] = useState('Party A Pvt Ltd');
  const [partyBName, setPartyBName] = useState('Party B LLP');
  const [effectiveDate, setEffectiveDate] = useState('2025-01-01');
  const [termMonths, setTermMonths] = useState(12);
  const [loading, setLoading] = useState(false);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/documents/nda.pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyAName, partyBName, effectiveDate, termMonths })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nda.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  async function onGenerateDocx(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/documents/nda.docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyAName, partyBName, effectiveDate, termMonths })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nda.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>NDA Generator</h2>
      <form onSubmit={onGenerate} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label>
          Party A Name
          <input value={partyAName} onChange={(e) => setPartyAName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Party B Name
          <input value={partyBName} onChange={(e) => setPartyBName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Effective Date
          <input value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Term (months)
          <input type="number" value={termMonths} onChange={(e) => setTermMonths(parseInt(e.target.value, 10) || 0)} style={{ width: '100%', padding: 8 }} />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate PDF'}</button>
          <button onClick={onGenerateDocx} disabled={loading} type="button">{loading ? 'Generating…' : 'Generate DOCX'}</button>
        </div>
      </form>
    </div>
  );
}
