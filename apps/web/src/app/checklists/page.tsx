async function fetchChecklists() {
  const res = await fetch('http://localhost:3000/api/checklists', { cache: 'no-store' });
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
            <a href={`/checklists/${c.slug}`}>{c.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
