import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { Task } from '../../../models/Task'
import { getUser } from '../../../lib/authentication'
import { getNewDisplayOrder } from '../../../repositories/SheetsRepository'

const prisma = new PrismaClient()

type RequestData = {
  task: Task
}

type ResponseData = {
  task: Task
}

const createTask = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { task: taskData } = req.body as RequestData
  const user = await getUser(req)

  const task = await prisma.task.create({
    data: {
      sheetId: taskData.sheetId,
      applicationId: taskData.applicationId,
      userId: user.id,
      name: taskData.name,
      body: taskData.body,
      displayOrder: await getNewDisplayOrder(user.id),
    },
  })

  res.status(201).json({
    task,
  })
}

export default authenticated(method(createTask, 'POST'))
