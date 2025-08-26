import Link from 'next/link';

async function fetchChecklist(slug: string) {
  const res = await fetch(`http://localhost:3000/api/checklists/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch checklist');
  return res.json();
}

export default async function ChecklistDetail({ params }: { params: { slug: string } }) {
  const { checklist } = await fetchChecklist(params.slug);
  return (
    <div>
      <p><Link href="/checklists">← Back</Link></p>
      <h2>{checklist.name}</h2>
      <ol>
        {checklist.items.map((i: any) => (
          <li key={i.id}>
            <strong>{i.text}</strong>
            <div style={{ color: '#555' }}>{i.guidance}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
