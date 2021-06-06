import type { NextApiRequest, NextApiResponse } from 'next'

export type Handler = (req: NextApiRequest, res: NextApiResponse) => void
