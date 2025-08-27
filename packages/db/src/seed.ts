import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed basic templates
  await prisma.legalTemplate.upsert({
    where: { slug: 'nda-en' },
    update: {},
    create: {
      slug: 'nda-en',
      name: 'Mutual NDA (EN)',
      category: 'NDA',
      language: 'en',
      bodyMd: `# Mutual Non-Disclosure Agreement\n\nThis document is provided for general information, not legal advice.\n\n## Parties\n- Party A: {{party_a_name}}\n- Party B: {{party_b_name}}\n\n## Purpose\nThe parties wish to explore a potential business relationship and agree to keep certain information confidential.\n\n## Term\nThis Agreement commences on {{effective_date}} and remains in effect for {{term_months}} months.\n\n`,
    },
  });

  await prisma.legalTemplate.upsert({
    where: { slug: 'rent-agreement-en' },
    update: {},
    create: {
      slug: 'rent-agreement-en',
      name: 'Rent Agreement (EN)',
      category: 'RENT_AGREEMENT',
      language: 'en',
      bodyMd: `# Rent Agreement\n\nGeneral information only. Consult an advocate for specific matters.\n\n`,
    },
  });

  // Seed compliance checklist (GST)
  const gst = await prisma.complianceChecklist.upsert({
    where: { slug: 'gst-basic' },
    update: {},
    create: {
      slug: 'gst-basic',
      name: 'GST Registration Basics',
      category: 'GST',
      items: {
        create: [
          { text: 'Turnover threshold check', guidance: 'Check if your annual turnover exceeds threshold per latest rules', order: 1 },
          { text: 'Obtain PAN and Aadhaar', guidance: 'Ensure PAN and Aadhaar are available and valid', order: 2 },
          { text: 'Proof of business registration', guidance: 'Incorporation certificate, partnership deed, or shop establishment license', order: 3 },
        ],
      },
    },
    include: { items: true },
  });

  console.log('Seed complete:', {
    templates: 2,
    checklists: 1,
    checklistItems: gst.items.length,
  });

  // Seed RAG sources
  const sources = [
    { slug: 'contract-act-1872', title: 'Indian Contract Act, 1872', language: 'en' as const },
    { slug: 'gst-act', title: 'GST Act and Rules', language: 'en' as const }
  ];
  for (const s of sources) {
    const src = await prisma.ragSource.upsert({ where: { slug: s.slug }, update: {}, create: s });
    const paragraphs = [
      'A contract requires offer, acceptance, lawful consideration, competency of parties, and free consent.',
      'GST registration is required above threshold turnover and for inter-state taxable supplies.'
    ];
    let idx = 0;
    const { embed } = await import('@legalassistant/ai');
    for (const p of paragraphs) {
      const emb = embed(p);
      await prisma.ragChunk.upsert({
        where: { id: `${src.id}-${idx}` },
        update: { text: p, order: idx, embedding: emb },
        create: { id: `${src.id}-${idx}`, sourceId: src.id, text: p, order: idx, embedding: emb }
      });
      idx++;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
