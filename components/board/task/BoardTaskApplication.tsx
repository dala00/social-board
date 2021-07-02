import { Box, Flex, IconButton, Select } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { MdDone, MdEdit } from 'react-icons/md'
import { useAuthentication } from '../../../hooks/authentication'
import { useBoard } from '../../../hooks/board'

export default function BoardTaskApplication() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const {
    userId,
    taskId,
    applicationId: currentApplicationId,
    getApplication,
    applications,
    getTask,
    updateTask,
  } = useBoard()
  const { currentUser } = useAuthentication()
  const application = useMemo(
    () => getApplication(currentApplicationId),
    [currentApplicationId]
  )
  const [applicationId, setApplicationId] = useState(currentApplicationId)

  const startEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const save = useCallback(async () => {
    setIsEditing(false)
    if (applicationId === currentApplicationId) {
      return
    }

    await axios.patch(`/api/tasks/${taskId}/update-application`, {
      applicationId,
    })
    const task = getTask(taskId)
    updateTask(taskId, { ...task, applicationId })
    router.push(`/board/${userId}/${applicationId}/${taskId}`)
  }, [applicationId])

  if (!isEditing) {
    return (
      <Box>
        {application.name}
        {currentUser?.uniqueId === userId && (
          <IconButton
            ml={2}
            aria-label="Edit"
            icon={<MdEdit />}
            isRound={true}
            onClick={startEdit}
          />
        )}
      </Box>
    )
  }

  return (
    <Flex>
      <Select
        value={applicationId}
        onChange={(e) => setApplicationId(e.target.value)}
      >
        {applications.map((app) => (
          <option value={app.id}>{app.name}</option>
        ))}
      </Select>

      <IconButton
        colorScheme="green"
        ml={2}
        aria-label="Edit"
        icon={<MdDone />}
        isRound={true}
        onClick={save}
      />
    </Flex>
  )
}
