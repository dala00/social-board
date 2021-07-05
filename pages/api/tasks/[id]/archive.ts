import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'

const prisma = new PrismaClient()

type Query = {
  id: string
}

type ResponseData = {
  result: boolean
}

const archiveTask = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { id } = req.query as Query
  const user = await getUser(req)

  await prisma.task.updateMany({
    where: { id, userId: user.id },
    data: { archivedAt: new Date() },
  })

  res.status(204).json({
    result: true,
  })
}

export default authenticated(method(archiveTask, 'PATCH'))
