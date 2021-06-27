import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'

export type Method = 'POST' | 'PUT' | 'PATCH'

type File = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export type NextApiRequestWithFormData = NextApiRequest & {
  files: File[]
}

type Callback = (req: NextApiRequestWithFormData, res: NextApiResponse) => void

export function multipartFormData(
  req: NextApiRequest,
  res: NextApiResponse,
  callback: Callback
) {
  const multerUpload = multer()
  multerUpload.any()(req, res, (result) =>
    callback(req as NextApiRequestWithFormData, res)
  )
}

export default multipartFormData
