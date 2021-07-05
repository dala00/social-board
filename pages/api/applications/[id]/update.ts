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
  applicationUrls: ApplicationUrl[]
  newApplicationUrls: ApplicationUrl[]
  deleteApplicationUrlIds: string[]
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
    const {
      name,
      description,
      applicationUrls = [],
      newApplicationUrls = [],
      deleteApplicationUrlIds = [],
    } = req.body as UpdateApplicationRequestData
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

    const updates = [
      prisma.application.updateMany({
        where: { id, userId: user.id },
        data,
      }),
    ]

    if (deleteApplicationUrlIds.length > 0) {
      updates.push(
        prisma.applicationUrl.deleteMany({
          where: {
            id: { in: deleteApplicationUrlIds },
          },
        })
      )
    }

    const applicationUrlsUpdates = applicationUrls.map((applicationUrl) => {
      const { name, url } = applicationUrl
      return prisma.applicationUrl.updateMany({
        where: { id: applicationUrl.id, applicationId: id },
        data: {
          name,
          url,
        },
      })
    })
    await Promise.all([...updates, ...applicationUrlsUpdates])

    for (const applicationUrl of newApplicationUrls) {
      const { name, url } = applicationUrl
      await prisma.applicationUrl.create({
        data: {
          applicationId: id,
          name,
          url,
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
