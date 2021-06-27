import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'
import { Application } from '../../../../models/Application'

const prisma = new PrismaClient()

type Query = {
  id: string
}

type ResponseData = {
  application: Application
}

const getApplicationForOwner = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { id } = req.query as Query
  const user = await getUser(req)

  const application = await prisma.application.findFirst({
    where: { id, userId: user.id },
    include: { applicationUrls: true },
  })

  res.status(200).json({
    application,
  })
}

export default authenticated(method(getApplicationForOwner, 'GET'))
