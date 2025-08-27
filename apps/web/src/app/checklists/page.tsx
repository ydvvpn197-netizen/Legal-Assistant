import { apiBase } from '../../lib/api';
async function fetchChecklists() {
  const res = await fetch(`${apiBase}/checklists`);
  if (!res.ok) throw new Error('Failed to fetch checklists');
  return res.json();
}

export default async function ChecklistsPage() {
  const { checklists } = await fetchChecklists();
  return (
    <div>
      <h2>Compliance Checklists</h2>
      <ul>
        {checklists.map((c: any) => (
          <li key={c.id}>
            <a href={`/checklists/view?slug=${encodeURIComponent(c.slug)}`}>{c.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
