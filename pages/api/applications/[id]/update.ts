import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'
import multipartFormData from '../../../../middlewares/multipartFormData'
import { generateUniqueFileName, upload } from '../../../../lib/storage'

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
  multipartFormData(req, res, async (req, res) => {
    const { name, description } = req.body as UpdateApplicationRequestData
    const { id } = req.query as Query
    const user = await getUser(req)

    if (req.files.length > 0) {
      const file = req.files[0]
      const fileName = generateUniqueFileName(file.originalname)
      const path = `application/${id}/icon/${fileName}`
      await upload('social-board-public', path, file.buffer)
    }

    await prisma.application.updateMany({
      where: { id, userId: user.id },
      data: { name: name.trim(), description },
    })

    res.status(204).json({
      result: true,
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default authenticated(method(updateApplication, 'PATCH'))
