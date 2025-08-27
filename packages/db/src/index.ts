import { PrismaClient } from '@prisma/client';

const fallbackDatabaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/legal_assistant?schema=public';
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = fallbackDatabaseUrl;
}

let prismaClientSingleton: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (!prismaClientSingleton) {
    prismaClientSingleton = new PrismaClient();
  }
  return prismaClientSingleton;
}

export type { Prisma, User } from '@prisma/client';
