import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("Missing required env var: DATABASE_URL")
  }

  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: url })
  }

  const safeUrl = url.replace("sslmode=require", "sslmode=verify-full")
  const adapter = new PrismaPg(safeUrl)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
