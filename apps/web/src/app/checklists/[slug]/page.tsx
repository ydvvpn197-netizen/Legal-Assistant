"use client";
import Link from 'next/link';
import ClientChecklist from './ClientChecklist';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiBase } from '../../../lib/api';

export default function ChecklistDetail() {
  const search = useSearchParams();
  const slug = search.get('slug') || '';
  const [checklist, setChecklist] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/checklists/${slug}`);
        const data = await res.json();
        setChecklist(data.checklist);
      } catch (e: any) {
        setError(e.message || 'Failed');
      }
    })();
  }, [slug]);
  return (
    <div>
      <p><Link href="/checklists">← Back</Link></p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {checklist && (
        <>
          <h2>{checklist.name}</h2>
          <ClientChecklist items={checklist.items} />
        </>
      )}
    </div>
  );
}
