import type { NextApiRequest, NextApiResponse } from 'next'
import { Application, PrismaClient } from '@prisma/client'
import method from '../../../middlewares/method'
import authenticated from '../../../middlewares/authenticated'
import { getUser } from '../../../lib/authentication'
import multipartFormData from '../../../middlewares/multipartFormData'
import { generateUniqueFileName, upload } from '../../../lib/server/storage'
import { ApplicationUrl } from '../../../models/ApplicationUrl'

const prisma = new PrismaClient()

export type CreateApplicationRequestData = {
  name: string
  description: string
  newApplicationUrls: ApplicationUrl[]
}

type ResponseData = {
  application: Application
}

const storeApplication = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  multipartFormData(req, res, async (req, res) => {
    const {
      name,
      description,
      newApplicationUrls = [],
    } = req.body as CreateApplicationRequestData
    const user = await getUser(req)

    const data = {
      userId: user.id,
      name: name.trim(),
      description,
      iconFileName: '',
      imageFileName: '',
      applicationUrls: { create: newApplicationUrls },
    }

    const application = await prisma.application.create({
      data,
      include: {
        applicationUrls: true,
      },
    })

    if (req.files.length > 0) {
      const file = req.files[0]
      const fileName = generateUniqueFileName(file.originalname)
      const path = `application/${application.id}/icon/${fileName}`
      await upload('social-board-public', path, file.buffer)

      await prisma.application.update({
        where: { id: application.id },
        data: {
          iconFileName: fileName,
        },
      })
    }

    res.status(201).json({
      result: true,
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default authenticated(method(storeApplication, 'POST'))
