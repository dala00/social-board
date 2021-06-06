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
import React, { useRef, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

export default function BoardCardCreateModal(props: Props) {
  const initialRef = useRef()
  const [name, setName] = useState('')

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
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
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => props.onSubmit(name)}
          >
            追加
          </Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
