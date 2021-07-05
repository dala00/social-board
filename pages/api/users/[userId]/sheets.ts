import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { UsersSheetsResponseData } from '../../../../types/api/users'

const prisma = new PrismaClient()

type Query = {
  userId: string
}

const sheetIndex = async (
  req: NextApiRequest,
  res: NextApiResponse<UsersSheetsResponseData>
) => {
  const { userId } = req.query as Query

  const user = await prisma.user.findUnique({
    where: { uniqueId: userId },
  })

  const sheets = await prisma.sheet.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { displayOrder: 'asc' },
    include: {
      tasks: {
        where: {
          archivedAt: null,
        },
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
    },
    include: {
      applicationUrls: true,
    },
  })

  res.status(200).json({
    user,
    applications,
    sheets,
  })
}

export default method(sheetIndex, 'GET')
