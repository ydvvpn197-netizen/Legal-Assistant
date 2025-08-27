import { apiBase } from '../lib/api';
async function fetchDocs() {
  const res = await fetch(`${apiBase}/documents`);
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
