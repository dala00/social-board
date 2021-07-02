import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'

const prisma = new PrismaClient()

export type UpdateApplicationRequestData = {
  applicationId: string
}

type Query = {
  id: string
}

type ResponseData = {
  result: boolean
}

const updateApplication = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { applicationId } = req.body as UpdateApplicationRequestData
  const { id } = req.query as Query
  const user = await getUser(req)

  await prisma.task.updateMany({
    where: { id, userId: user.id },
    data: { applicationId },
  })

  res.status(204).json({
    result: true,
  })
}

export default authenticated(method(updateApplication, 'PATCH'))
