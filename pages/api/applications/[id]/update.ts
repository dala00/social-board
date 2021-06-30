import type { NextApiRequest, NextApiResponse } from 'next'
import { Application, PrismaClient } from '@prisma/client'
import method from '../../../../middlewares/method'
import authenticated from '../../../../middlewares/authenticated'
import { getUser } from '../../../../lib/authentication'
import multipartFormData from '../../../../middlewares/multipartFormData'
import { generateUniqueFileName, upload } from '../../../../lib/server/storage'
import { ApplicationUrl } from '../../../../models/ApplicationUrl'

const prisma = new PrismaClient()

export type UpdateApplicationRequestData = {
  name: string
  description: string
  newApplicationUrls: ApplicationUrl[]
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
    const { name, description, newApplicationUrls } =
      req.body as UpdateApplicationRequestData
    const { id } = req.query as Query
    const user = await getUser(req)

    const data = { name: name.trim(), description } as Application

    if (req.files.length > 0) {
      const file = req.files[0]
      const fileName = generateUniqueFileName(file.originalname)
      const path = `application/${id}/icon/${fileName}`
      await upload('social-board-public', path, file.buffer)
      data.iconFileName = fileName
    }

    await prisma.application.updateMany({
      where: { id, userId: user.id },
      data,
    })

    for (const applicationUrl of newApplicationUrls) {
      await prisma.applicationUrl.create({
        data: {
          applicationId: id,
          name: applicationUrl.name,
          url: applicationUrl.url,
        },
      })
    }

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
