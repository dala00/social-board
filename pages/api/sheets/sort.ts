import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { getUser } from '../../../lib/authentication'
import { Sheet } from '../../../models/Sheet'

const prisma = new PrismaClient()

export type SortSheetRequestData = {
  sheetIds: string[]
}

type ResponseData = {
  sheets: Sheet[]
}

const createTask = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { sheetIds } = req.body as SortSheetRequestData
  const user = await getUser(req)

  const updates = sheetIds.map((sheetId, index) =>
    prisma.sheet.update({
      where: { id: sheetId },
      data: { displayOrder: index },
    })
  )
  await Promise.all(updates)

  const sheets = await prisma.sheet.findMany({
    where: { userId: user.id },
    include: { tasks: true },
    orderBy: { displayOrder: 'asc' },
  })

  res.status(201).json({
    sheets,
  })
}

export default authenticated(method(createTask, 'PUT'))
