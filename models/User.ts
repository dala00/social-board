import { User as PrismaUser } from '.prisma/client'

export type User = PrismaUser & {
  uniqueId: string
}
