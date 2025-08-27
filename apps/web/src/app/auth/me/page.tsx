async function fetchMe() {
  const res = await fetch('http://localhost:3000/api/auth/me', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default async function MePage() {
  const { user } = await fetchMe();
  return (
    <div>
      <h2>My Account</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name || '-'}</p>
          <form action="/api/me" method="post" onSubmit={async (e) => {
            e.preventDefault();
            await fetch('/api/me', { method: 'DELETE' });
            window.location.href = '/';
          }}>
            <button type="submit" style={{ marginTop: 12 }}>Delete my account</button>
          </form>
        </div>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}
