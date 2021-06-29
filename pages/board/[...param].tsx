import axios from 'axios'
import { useEffect } from 'react'
import { useCallback } from 'react'
import Board from '../../components/board/Board'
import BoardTaskDetail from '../../components/board/task/BoardTaskDetail'
import { useBoard } from '../../hooks/board'
import { UsersSheetsResponseData } from '../../types/api/users'

export default function BoardPage() {
  const { setApplications, setSheets, taskId, applicationId, setUser, userId } =
    useBoard()

  const initialize = useCallback(async () => {
    const response = await axios.get<UsersSheetsResponseData>(
      `/api/users/${userId}/sheets`
    )
    setUser(response.data.user)
    setSheets(response.data.sheets)
    setApplications(response.data.applications)
  }, [userId])

  useEffect(() => {
    if (!userId) {
      return
    }
    initialize()
  }, [userId, applicationId, taskId])

  if (taskId) {
    return <BoardTaskDetail />
  }

  return <Board />
}
