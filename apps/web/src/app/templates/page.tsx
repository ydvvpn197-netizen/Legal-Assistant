import { apiBase } from '../../lib/api';
async function fetchTemplates() {
  const res = await fetch(`${apiBase}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export default async function TemplatesPage() {
  const { templates } = await fetchTemplates();
  return (
    <div>
      <h2>Legal Templates</h2>
      <ul>
        {templates.map((t: any) => (
          <li key={t.id}>
            <a href={`/templates/${t.slug}`}>{t.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
