import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { useCallback } from 'react'
import { MdEdit } from 'react-icons/md'
import { useAuthentication } from '../../../hooks/authentication'
import { useBoard } from '../../../hooks/board'

export default function BoardTaskName() {
  const { userId, taskId, getTask, updateTask, sheets } = useBoard()
  const { currentUser } = useAuthentication()
  const task = useMemo(() => getTask(taskId), [taskId, sheets])
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')

  const startEdit = useCallback(() => {
    setName(task.name)
    setIsEditing(true)
  }, [task])

  const save = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsEditing(false)
      if (name === task.name) {
        return
      }

      updateTask(taskId, { ...task, name })
      axios.patch(`/api/tasks/${taskId}/update`, { name }).catch((_) => null)
    },
    [task, name]
  )

  if (!isEditing) {
    return (
      <Heading>
        <Box display="inline-block" mr={2}>
          {task.name}
        </Box>
        {currentUser?.uniqueId === userId && (
          <IconButton
            aria-label="Edit"
            icon={<MdEdit />}
            isRound={true}
            onClick={startEdit}
          />
        )}
      </Heading>
    )
  } else {
    return (
      <form onSubmit={save}>
        <FormControl id="email">
          <Flex width="100%" maxWidth={500}>
            <Input
              type="text"
              placeholder="タスク名"
              width="100%"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Button
              colorScheme="blue"
              type="submit"
              ml={2}
              disabled={name.trim() === ''}
            >
              Submit
            </Button>
          </Flex>
        </FormControl>
      </form>
    )
  }
}
