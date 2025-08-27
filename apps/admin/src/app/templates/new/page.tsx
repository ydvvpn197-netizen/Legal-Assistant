"use client";
import { useState } from 'react';

export default function NewTemplatePage() {
  const [name, setName] = useState('Sample Template');
  const [slug, setSlug] = useState('sample-template');
  const [category, setCategory] = useState('NDA');
  const [language, setLanguage] = useState('en');
  const [bodyMd, setBodyMd] = useState('# Title');
  const [isPremium, setIsPremium] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, category, language, bodyMd, isPremium })
    });
    const data = await res.json();
    setMessage(res.ok ? `Saved ${data.template.name}` : data.message || 'Failed');
  }

  return (
    <div>
      <h2>New Template</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} /></label>
        <label>Slug<input value={slug} onChange={(e) => setSlug(e.target.value)} style={{ width: '100%' }} /></label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>NDA</option>
            <option>RENT_AGREEMENT</option>
            <option>EMPLOYMENT_OFFER</option>
            <option>TERMINATION_NOTICE</option>
            <option>FOUNDERS_AGREEMENT</option>
            <option>PRIVACY_POLICY</option>
          </select>
        </label>
        <label>Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </label>
        <label>Premium <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} /></label>
        <label>Body MD
          <textarea value={bodyMd} onChange={(e) => setBodyMd(e.target.value)} rows={10} style={{ width: '100%' }} />
        </label>
        <button type="submit">Save</button>
      </form>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}
