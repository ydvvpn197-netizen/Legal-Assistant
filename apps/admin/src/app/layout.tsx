import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Console - Legal Assistant',
  description: 'Manage users, templates, flags'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <header style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
          <strong>Admin Console</strong>
        </header>
        <main style={{ padding: '20px', maxWidth: 1024, margin: '0 auto' }}>{children}</main>
      </body>
    </html>
  );
}
