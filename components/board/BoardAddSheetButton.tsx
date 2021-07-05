import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { getBackgroundColor as getSheetBackgroundColor } from './BoardSheet'
import { MdAdd } from 'react-icons/md'
import { useBoard } from '../../hooks/board'
import { useCallback } from 'react'
import axios from 'axios'
import { CreateSheetResponseData } from '../../types/api/sheets'

export default function BoardAddSheetButton() {
  const { setSheets } = useBoard()
  const initialRef = useRef()
  const [name, setName] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const createSheet = useCallback(async (name: string) => {
    const response = await axios.post<CreateSheetResponseData>(
      '/api/sheets/store',
      { name }
    )
    setName('')
    setSheets((sheets) => [...sheets, response.data.sheet])
    onClose()
  }, [])

  return (
    <>
      <IconButton
        backgroundColor={getSheetBackgroundColor()}
        aria-label="Search database"
        icon={<MdAdd />}
        onClick={() => onOpen()}
      />

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>タスクを追加</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>シート名</FormLabel>
              <Input
                ref={initialRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => createSheet(name)}>
              追加
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
