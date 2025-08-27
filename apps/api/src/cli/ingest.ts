import fs from 'node:fs/promises';
import path from 'node:path';
import pdfParse from 'pdf-parse';
import { getPrismaClient } from '@legalassistant/db';
import { embed } from '@legalassistant/ai';

type Args = {
  slug: string;
  title: string;
  language: 'en' | 'hi';
  file?: string;
  dir?: string;
};

function parseArgs(argv: string[]): Args {
  const args: any = { language: 'en' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') args.slug = argv[++i];
    else if (a === '--title') args.title = argv[++i];
    else if (a === '--language') args.language = argv[++i];
    else if (a === '--file') args.file = argv[++i];
    else if (a === '--dir') args.dir = argv[++i];
  }
  if (!args.slug || !args.title || (!args.file && !args.dir)) {
    console.error('Usage: pnpm -F @legalassistant/api ingest -- --slug <slug> --title <title> [--language en|hi] (--file <path> | --dir <dir>)');
    process.exit(1);
  }
  return args as Args;
}

async function extractText(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const result = await pdfParse(data);
    return (result.text || '').trim();
  }
  return data.toString('utf8');
}

function chunkText(input: string, target = 800): string[] {
  const paras = input.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const p of paras) {
    if ((current + ' ' + p).length > target && current) {
      chunks.push(current.trim());
      current = p;
    } else {
      current = current ? current + '\n\n' + p : p;
    }
  }
  if (current) chunks.push(current.trim());
  // If still too long, hard-split
  const normalized: string[] = [];
  for (const c of chunks) {
    if (c.length <= target * 1.5) normalized.push(c);
    else {
      for (let i = 0; i < c.length; i += target) normalized.push(c.slice(i, i + target));
    }
  }
  return normalized;
}

async function main() {
  const args = parseArgs(process.argv);
  const prisma = getPrismaClient();
  const files: string[] = [];
  if (args.file) files.push(path.resolve(args.file));
  if (args.dir) {
    const full = path.resolve(args.dir);
    const entries = await fs.readdir(full);
    for (const e of entries) {
      const fp = path.join(full, e);
      const stat = await fs.stat(fp);
      if (stat.isFile()) files.push(fp);
    }
  }
  const src = await prisma.ragSource.upsert({ where: { slug: args.slug }, update: { title: args.title, language: args.language }, create: { slug: args.slug, title: args.title, language: args.language } });
  await prisma.ragChunk.deleteMany({ where: { sourceId: src.id } });

  let order = 0;
  for (const f of files) {
    const text = (await extractText(f)).trim();
    if (!text) continue;
    const chunks = chunkText(text);
    for (const c of chunks) {
      const emb = embed(c);
      await prisma.ragChunk.create({ data: { sourceId: src.id, order: order++, text: c, embedding: emb, metadata: { file: f } } });
    }
  }
  console.log(`Ingested ${order} chunks into source ${args.slug}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
