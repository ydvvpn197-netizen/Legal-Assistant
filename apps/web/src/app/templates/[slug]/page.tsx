import Link from 'next/link';

async function fetchTemplate(slug: string) {
  const res = await fetch(`http://localhost:3000/api/templates/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch template');
  return res.json();
}

export default async function TemplateDetail({ params }: { params: { slug: string } }) {
  const { template } = await fetchTemplate(params.slug);
  return (
    <div>
      <p><Link href="/templates">← Back</Link></p>
      <h2>{template.name}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{template.bodyMd}</pre>
    </div>
  );
}
