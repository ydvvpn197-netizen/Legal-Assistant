"use client";
import Link from 'next/link';

export default function Nav() {
  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.reload();
    }
  }

  const linkStyle: React.CSSProperties = { textDecoration: 'underline' };
  return (
    <nav style={{ display: 'flex', gap: 12 }}>
      <Link href="/" style={linkStyle}>Home</Link>
      <Link href="/templates" style={linkStyle}>Templates</Link>
      <Link href="/checklists" style={linkStyle}>Checklists</Link>
      <Link href="/chat" style={linkStyle}>Chat</Link>
      <Link href="/documents/nda" style={linkStyle}>NDA</Link>
      <Link href="/documents" style={linkStyle}>My Docs</Link>
      <Link href="/summaries" style={linkStyle}>Summaries</Link>
      <Link href="/auth/login" style={linkStyle}>Login</Link>
      <Link href="/auth/register" style={linkStyle}>Register</Link>
      <Link href="/auth/me" style={linkStyle}>Me</Link>
      <Link href="/billing" style={linkStyle}>Billing</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
