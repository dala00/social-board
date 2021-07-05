import axios from 'axios'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import Board from '../../components/board/Board'
import BoardTaskDetail from '../../components/board/task/BoardTaskDetail'
import { useBoard } from '../../hooks/board'
import { UsersSheetsResponseData } from '../../types/api/users'

export default function BoardPage() {
  const { setApplications, setSheets, taskId, applicationId, setUser, userId } =
    useBoard()
  const [loading, setLoading] = useState(true)

  const initialize = useCallback(async () => {
    const response = await axios.get<UsersSheetsResponseData>(
      `/api/users/${userId}/sheets`
    )
    setUser(response.data.user)
    setSheets(response.data.sheets)
    setApplications(response.data.applications)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) {
      return
    }
    initialize()
  }, [userId, applicationId, taskId])

  if (loading) {
    return <></>
  }

  if (taskId) {
    return <BoardTaskDetail />
  }

  return <Board />
}
