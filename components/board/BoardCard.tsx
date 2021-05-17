import { Box } from '@chakra-ui/layout'
import { Task } from '../../models/Task'

type Props = {
  task: Task
}

export default function BoardCard(props: Props) {
  return (
    <Box backgroundColor="white" borderRadius={8} m={4} p={4} width={300}>
      {props.task.body}
    </Box>
  )
}
