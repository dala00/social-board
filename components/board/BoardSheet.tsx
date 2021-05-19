import { Box } from '@chakra-ui/layout'
import { Sheet } from '../../models/Sheet'
import BoardCard from './BoardCard'

type Props = {
  sheet: Sheet
}

export default function BoardSheet(props: Props) {
  return (
    <Box backgroundColor="gray.400" borderRadius={8} mr={4} py={1}>
      <Box m={4}>{props.sheet.name}</Box>
      {props.sheet.tasks.map((task) => (
        <BoardCard key={task.id} task={task} />
      ))}
    </Box>
  )
}
