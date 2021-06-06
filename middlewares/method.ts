import type { NextApiRequest, NextApiResponse } from 'next'
import { Handler } from '../types/middleware'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const method =
  (handler: Handler, method: Method) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) {
      res.setHeader('Allow', [method])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      return
    }

    return handler(req, res)
  }

export default method
