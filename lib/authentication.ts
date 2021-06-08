import { User } from '.prisma/client'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/client'

export async function getUser(req: NextApiRequest) {
  const session = await getSession({ req })
  return session.user as User
}
