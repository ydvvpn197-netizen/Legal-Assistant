"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiBase } from '../../../lib/api';

export default function TemplateDetail() {
  const search = useSearchParams();
  const slug = search.get('slug') || '';
  const [template, setTemplate] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/templates/${slug}`);
        const data = await res.json();
        setTemplate(data.template);
      } catch (e: any) {
        setError(e.message || 'Failed');
      }
    })();
  }, [slug]);
  return (
    <div>
      <p><Link href="/templates">← Back</Link></p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {template && (
        <>
          <h2>{template.name}</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{template.bodyMd}</pre>
        </>
      )}
    </div>
  );
}
