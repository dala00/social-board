import Icon from '@chakra-ui/icon'
import { Box, Flex } from '@chakra-ui/layout'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { GrDrag } from 'react-icons/gr'
import { Sheet } from '../../models/Sheet'
import BoardCard from './BoardCard'

type Props = {
  sheet: Sheet
  listeners: SyntheticListenerMap
}

export default function BoardSheet(props: Props) {
  return (
    <Box backgroundColor="gray.400" borderRadius={8} mr={4} py={1}>
      <Flex alignItems={'center'} m={4} cursor={'grab'} {...props.listeners}>
        <Icon as={GrDrag}></Icon>
        <Box ml={2}>{props.sheet.name}</Box>
      </Flex>
      {props.sheet.tasks.map((task) => (
        <BoardCard key={task.id} task={task} />
      ))}
    </Box>
  )
}
