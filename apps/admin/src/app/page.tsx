async function fetchUsers() {
  const res = await fetch('http://localhost:3001/api/admin/users', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

async function fetchTemplates() {
  const res = await fetch('http://localhost:3001/api/admin/templates', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default async function AdminHome() {
  const [{ users }, { templates }] = await Promise.all([fetchUsers(), fetchTemplates()]);
  return (
    <div>
      <h2>Overview</h2>
      <h3>Users</h3>
      <ul>
        {users.map((u: any) => (
          <li key={u.id}>{u.email} — {u.role} — {u.plan}</li>
        ))}
      </ul>
      <h3>Templates</h3>
      <ul>
        {templates.map((t: any) => (
          <li key={t.id}>{t.name} {t.isPremium ? '(Premium)' : ''}</li>
        ))}
      </ul>
    </div>
  );
}
