import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'

const prisma = new PrismaClient()

export type UpdateApplicationRequestData = {
  name: string
  description: string
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
  const { name, description } = req.body as UpdateApplicationRequestData
  const { id } = req.query as Query
  const user = await getUser(req)

  await prisma.application.updateMany({
    where: { id, userId: user.id },
    data: { name: name.trim(), description },
  })

  res.status(204).json({
    result: true,
  })
}

export default authenticated(method(updateApplication, 'PATCH'))
