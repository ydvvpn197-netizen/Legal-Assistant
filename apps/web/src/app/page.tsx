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
    </div>
  );
}
