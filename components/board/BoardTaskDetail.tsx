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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useBoard } from '../../hooks/board'

export default function BoardTaskDetail() {
  const router = useRouter()
  const { userId, applicationId, taskId, getTask } = useBoard()
  const task = useMemo(() => getTask(taskId), [taskId])

  const onClose = useCallback(() => router.back(), [userId, applicationId])

  return (
    <Modal size="6xl" isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>タイトル</FormLabel>
          </FormControl>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
