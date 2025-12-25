import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

// Prisma 7 with Prisma Postgres requires accelerateUrl
const accelerateUrl = process.env.DATABASE_URL;

if (!accelerateUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
