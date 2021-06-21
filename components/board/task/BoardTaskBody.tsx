import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Text,
  Textarea,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { useCallback } from 'react'
import { MdEdit } from 'react-icons/md'
import { useAuthentication } from '../../../hooks/authentication'
import { useBoard } from '../../../hooks/board'

export default function BoardTaskBody() {
  const { userId, taskId, getTask, updateTask, sheets } = useBoard()
  const { currentUser } = useAuthentication()
  const task = useMemo(() => getTask(taskId), [taskId, sheets])
  const [isEditing, setIsEditing] = useState(false)
  const [body, setBody] = useState('')

  const startEdit = useCallback(() => {
    setBody(task.body)
    setIsEditing(true)
  }, [task])

  const save = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsEditing(false)
      if (body === task.body) {
        return
      }

      updateTask(taskId, { ...task, body })
      axios
        .patch(`/api/tasks/${taskId}/update-body`, { body })
        .catch((_) => null)
    },
    [task, body]
  )

  if (!isEditing) {
    return (
      <Box>
        <Text display="inline-block" mr={2} whiteSpace="pre">
          {task.body}
        </Text>
        {currentUser?.uniqueId === userId && (
          <Box mt={2}>
            <Button aria-label="Edit Body" onClick={startEdit}>
              編集する
            </Button>
          </Box>
        )}
      </Box>
    )
  } else {
    return (
      <form onSubmit={save}>
        <FormControl id="email">
          <Box width="100%" maxWidth={700}>
            <Textarea
              placeholder="内容"
              width="100%"
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <Button
              colorScheme="blue"
              type="submit"
              ml={2}
              disabled={body.trim() === ''}
            >
              Submit
            </Button>
          </Box>
        </FormControl>
      </form>
    )
  }
}
