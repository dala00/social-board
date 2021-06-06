import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { Task } from '../../../models/Task'

const prisma = new PrismaClient()

type RequestData = {
  task: Task
}

type ResponseData = {
  task: Task
}

const createTask = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { task } = req.body as RequestData

  res.status(201).json({ task: { id: 100, sheetId: 1, body: task.body } })
}

export default authenticated(method(createTask, 'POST'))
