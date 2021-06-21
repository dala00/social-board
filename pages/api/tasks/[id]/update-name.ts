import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'

const prisma = new PrismaClient()

export type UpdateTaskNameRequestData = {
  name: string
}

type Query = {
  id: string
}

type ResponseData = {
  result: boolean
}

const updateTaskName = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { name } = req.body as UpdateTaskNameRequestData
  const { id } = req.query as Query
  const user = await getUser(req)

  await prisma.task.updateMany({
    where: { id, userId: user.id },
    data: { name: name.trim() },
  })

  res.status(204).json({
    result: true,
  })
}

export default authenticated(method(updateTaskName, 'PATCH'))
