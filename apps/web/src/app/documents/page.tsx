async function fetchDocs() {
  const res = await fetch('http://localhost:3000/api/documents', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default async function DocumentsPage() {
  const { documents } = await fetchDocs();
  return (
    <div>
      <h2>My Documents</h2>
      <ul>
        {documents.map((d: any) => (
          <li key={d.id}>
            {d.type} ({d.format}) — <a href={`/api/documents/${d.id}/download`}>Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
