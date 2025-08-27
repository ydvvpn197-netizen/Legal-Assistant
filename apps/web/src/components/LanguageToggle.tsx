"use client";
import { useEffect, useState } from 'react';

export default function LanguageToggle() {
  const [lang, setLang] = useState<'en' | 'hi'>(() => (typeof window !== 'undefined' ? ((localStorage.getItem('lang') as 'en' | 'hi') || 'en') : 'en'));
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);
  return (
    <div>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        Language:
        <select value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'hi')}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </label>
    </div>
  );
}
