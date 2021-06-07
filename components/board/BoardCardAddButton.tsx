import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useDisclosure,
  Box,
  Icon,
} from '@chakra-ui/react'
import { Task } from '@prisma/client'
import axios from 'axios'
import React, { useCallback, useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { useBoard } from '../../hooks/board'

type Props = {
  sheetId: string
}

type CreateTaskResponse = {
  task: Task
}

export default function BoardCardAddButton(props: Props) {
  const initialRef = useRef()
  const [name, setName] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { sheets, addTask } = useBoard()

  const createTask = useCallback(
    async (name: string) => {
      const response = await axios
        .post<CreateTaskResponse>('/api/tasks/create', {
          task: { sheetId: props.sheetId, name, body: '' },
        })
        .catch((_error) => null)
      if (!response) {
        return
      }

      onClose()
      addTask(props.sheetId, response.data.task)
    },
    [sheets]
  )

  return (
    <>
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
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タスクを追加</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>タイトル</FormLabel>
              <Input
                ref={initialRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => createTask(name)}>
              追加
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
