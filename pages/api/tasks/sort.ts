import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { getUser } from '../../../lib/authentication'
import { Task } from '../../../models/Task'

const prisma = new PrismaClient()

export type TaskSheetRequestData = {
  sheetId: string
  taskIds: string[]
}

type ResponseData = {
  tasks: Task[]
}

const createTask = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { sheetId, taskIds } = req.body as TaskSheetRequestData
  const user = await getUser(req)

  const updates = taskIds.map((taskId, index) =>
    prisma.task.updateMany({
      where: { id: taskId, userId: user.id },
      data: { displayOrder: index },
    })
  )
  await Promise.all(updates)

  const tasks = await prisma.task.findMany({
    where: { sheetId, userId: user.id },
    orderBy: { displayOrder: 'asc' },
  })

  res.status(201).json({
    tasks,
  })
}

export default authenticated(method(createTask, 'PUT'))
