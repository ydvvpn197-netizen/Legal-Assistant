export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>
        This MVP provides a starting point for an AI-powered Indian legal information assistant. Use the navigation to access
        chat and document tools as we expand.
      </p>
      <ul>
        <li>Secure API backend (Fastify) with health checks</li>
        <li>Database ready (PostgreSQL + Prisma)</li>
        <li>Next.js web app with disclaimer</li>
      </ul>
      <p>
        Start by checking the API health:
        <code style={{ marginLeft: 8 }}>/api/healthz</code>
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <a href="/templates" style={{ textDecoration: 'underline' }}>View Templates</a>
        <a href="/checklists" style={{ textDecoration: 'underline' }}>View Compliance Checklists</a>
        <a href="/chat" style={{ textDecoration: 'underline' }}>Try Chat</a>
        <a href="/documents/nda" style={{ textDecoration: 'underline' }}>Generate NDA</a>
      </div>
    </div>
  );
}
