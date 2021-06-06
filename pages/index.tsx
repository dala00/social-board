import { signIn, signOut, useSession } from 'next-auth/client'

export default function Home() {
  const [session, loading] = useSession()

  return (
    <div>
      <div>index</div>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  )
}
