import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useBoard } from '../../hooks/board'

export default function BoardApplications() {
  const router = useRouter()
  const { applications, applicationId, userId } = useBoard()

  const selectApplication = useCallback(
    (applicationId) => {
      router.push(`/board/${userId}/${applicationId}`)
    },
    [userId]
  )

  return (
    <div>
      <a href="#" onClick={() => router.push(`/board/${userId}`)}>
        nothing
      </a>
      {applications.map((application) => (
        <div>
          <a href="#" onClick={() => selectApplication(application.id)}>
            {applicationId === application.id && <div>o </div>}
            {application.name}
          </a>
        </div>
      ))}
    </div>
  )
}
