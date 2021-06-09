import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { getUser } from '../../../lib/authentication'
import { Sheet } from '../../../models/Sheet'
import { MoveTaskRequestData } from '../../../types/api/tasks'

const prisma = new PrismaClient()

type ResponseData = {
  fromSheet: Sheet
  toSheet: Sheet
}

function getUpdateData(
  taskId: string,
  toTaskId: string,
  sheetId: string,
  index: number
) {
  if (taskId != toTaskId) {
    return {
      displayOrder: index,
    }
  } else {
    return {
      sheetId: sheetId,
      displayOrder: index,
    }
  }
}

const createTask = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { taskId, fromSheetId, toSheetId, toTaskIds } =
    req.body as MoveTaskRequestData
  const user = await getUser(req)

  const updates = toTaskIds.map((toTaskId, index) =>
    prisma.task.updateMany({
      where: { id: toTaskId, userId: user.id },
      data: getUpdateData(taskId, toTaskId, toSheetId, index),
    })
  )
  await Promise.all(updates)

  const fromSheet = (await prisma.sheet.findFirst({
    where: { id: fromSheetId, userId: user.id },
  })) as Sheet
  const toSheet = (await prisma.sheet.findFirst({
    where: { id: toSheetId, userId: user.id },
  })) as Sheet

  res.status(204).json({
    fromSheet,
    toSheet,
  })
}

export default authenticated(method(createTask, 'PUT'))
