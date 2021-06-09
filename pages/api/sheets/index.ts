import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { getUser } from '../../../lib/authentication'
import { Sheet } from '../../../models/Sheet'

const prisma = new PrismaClient()

type ResponseData = {
  sheets: Sheet[]
}

const sheetIndex = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const user = await getUser(req)

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
