import { Session } from 'next-auth'
import { useSession } from 'next-auth/client'
import { User } from '../models/User'

function getUser(session: Session, loading: boolean): User | undefined {
  if (loading) {
    return undefined
  }
  if (!session?.user) {
    return undefined
  }

  return session.user as User
}

export function useAuthentication() {
  const [session, loading] = useSession()
  const user = getUser(session, loading)

  return { session, loading, currentUser: user }
}
