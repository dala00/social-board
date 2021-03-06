import Icon from '@chakra-ui/icon'
import { Box, Flex } from '@chakra-ui/layout'
import { useColorModeValue } from '@chakra-ui/react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { GrDrag } from 'react-icons/gr'
import { Sheet } from '../../models/Sheet'
import BoardCardAddButton from './BoardCardAddButton'

type Props = {
  sheet: Sheet
  listeners: SyntheticListenerMap
  children: React.ReactNode
}

export const getBackgroundColor = () =>
  useColorModeValue('gray.400', 'gray.500')

export default function BoardSheet(props: Props) {
  return (
    <>
      <Box
        backgroundColor={getBackgroundColor()}
        borderRadius={8}
        mr={4}
        py={1}
      >
        <Flex alignItems={'center'} m={4} cursor={'grab'} {...props.listeners}>
          <Icon as={GrDrag}></Icon>
          <Box ml={2}>{props.sheet.name}</Box>
        </Flex>
        <Box minWidth={332} minHeight={50}>
          {props.children}
        </Box>
        <BoardCardAddButton sheetId={props.sheet.id} />
      </Box>
    </>
  )
}
