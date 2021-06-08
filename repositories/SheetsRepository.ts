import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getNewDisplayOrder(userId: string): Promise<number> {
  const maxSheet = await prisma.sheet.findFirst({
    where: { userId },
    orderBy: { displayOrder: 'desc' },
  })
  if (!maxSheet) {
    return 0
  }
  return maxSheet.displayOrder + 1
}
