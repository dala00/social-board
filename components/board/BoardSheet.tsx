import Icon from '@chakra-ui/icon'
import { Box, Flex } from '@chakra-ui/layout'
import { Button, useDisclosure } from '@chakra-ui/react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import axios from 'axios'
import { useCallback } from 'react'
import { GrDrag } from 'react-icons/gr'
import { MdAdd } from 'react-icons/md'
import { useBoard } from '../../hooks/board'
import { Sheet } from '../../models/Sheet'
import { Task } from '../../models/Task'
import BoardCardCreateModal from './BoardCardCreateModal'

type Props = {
  sheet: Sheet
  listeners: SyntheticListenerMap
  children: React.ReactNode
}

type CreateTaskResponse = {
  task: Task
}

export default function BoardSheet(props: Props) {
  const { sheets, addTask } = useBoard()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const createTask = useCallback(
    async (name: string) => {
      const response = await axios
        .post<CreateTaskResponse>('/api/tasks/create', {
          task: { sheetId: props.sheet.id, name, body: '' },
        })
        .catch((error) => null)
      if (!response) {
        return
      }

      addTask(props.sheet.id, response.data.task)
    },
    [sheets]
  )

  return (
    <>
      <Box backgroundColor="gray.400" borderRadius={8} mr={4} py={1}>
        <Flex alignItems={'center'} m={4} cursor={'grab'} {...props.listeners}>
          <Icon as={GrDrag}></Icon>
          <Box ml={2}>{props.sheet.name}</Box>
        </Flex>
        {props.children}
        <Box textAlign="center" m={4}>
          <Button
            colorScheme="teal"
            variant="ghost"
            width="100%"
            onClick={onOpen}
          >
            <Icon as={MdAdd} />
          </Button>
        </Box>
      </Box>
      <BoardCardCreateModal
        onClose={onClose}
        isOpen={isOpen}
        onSubmit={createTask}
      />
    </>
  )
}
