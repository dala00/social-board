import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { Sheet } from '../../../../models/Sheet'

const prisma = new PrismaClient()

type Query = {
  userId: string
}

type ResponseData = {
  sheets: Sheet[]
}

const sheetIndex = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
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
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  res.status(200).json({
    sheets,
  })
}

export default authenticated(method(sheetIndex, 'GET'))
