import Link from 'next/link'
import { Box } from '@chakra-ui/layout'
import { Task } from '../../models/Task'
import { useBoard } from '../../hooks/board'
import { useMemo } from 'react'

type Props = {
  task: Task
}

export default function BoardCard(props: Props) {
  const { getSheet, userId, applicationId } = useBoard()
  const sheet = getSheet(props.task.sheetId)

  const isOpen = useMemo(
    () => !applicationId || props.task.applicationId === applicationId,
    [applicationId]
  )

  return (
    <Box hidden={!isOpen}>
      <Link
        href={`/board/${userId}/${props.task.applicationId}/${props.task.id}`}
      >
        <Box backgroundColor="white" borderRadius={8} m={4} p={4} width={300}>
          {props.task.name}
        </Box>
      </Link>
    </Box>
  )
}
