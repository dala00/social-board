import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { Handler } from '../types/middleware'

const authenticated =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    if (!session) {
      res.status(401).end()
      return
    }

    return handler(req, res)
  }

export default authenticated
