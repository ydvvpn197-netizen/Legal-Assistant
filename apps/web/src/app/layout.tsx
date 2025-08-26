import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'AI Legal Assistant (India) - MVP',
  description: 'General legal information assistant for India. Not legal advice.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <header style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
          <strong>AI Legal Assistant (India)</strong>
        </header>
        <main style={{ padding: '20px', maxWidth: 920, margin: '0 auto' }}>{children}</main>
        <footer style={{ padding: '20px', borderTop: '1px solid #eee', marginTop: 40 }}>
          <small>
            This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.
          </small>
        </footer>
      </body>
    </html>
  );
}
