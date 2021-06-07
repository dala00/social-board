import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { Task } from '../../../models/Task'
import { getSession } from 'next-auth/client'

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
  const session = await getSession({ req })

  const task = await prisma.task.create({
    data: {
      sheetId: taskData.sheetId,
      userId: (session.user as { id: string }).id,
      name: taskData.name,
      body: taskData.body,
    },
  })

  res.status(201).json({
    task,
  })
}

export default authenticated(method(createTask, 'POST'))
