import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { getUser } from '../../../lib/authentication'
import { getNewDisplayOrder } from '../../../repositories/SheetsRepository'
import { CreateSheetResponseData } from '../../../types/api/sheets'

const prisma = new PrismaClient()

export type CreateSheetRequestData = {
  name: string
}

const storeSheet = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateSheetResponseData>
) => {
  console.log(req)
  const { name } = req.body as CreateSheetRequestData
  const user = await getUser(req)

  const data = {
    applicationId: '1',
    userId: user.id,
    name: name.trim(),
    displayOrder: await getNewDisplayOrder(user.id),
  }

  const sheet = await prisma.sheet.create({
    data,
  })

  res.status(201).json({
    sheet: {
      ...sheet,
      tasks: [],
    },
  })
}

export default authenticated(method(storeSheet, 'POST'))
