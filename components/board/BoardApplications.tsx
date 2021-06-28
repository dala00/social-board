import Link from 'next/link'
import { Box, Button, Icon, Image, useColorMode } from '@chakra-ui/react'
import { useBoard } from '../../hooks/board'
import BoardApplication from './BoardApplication'
import { MdClear } from 'react-icons/md'
import { getIconUrl } from '../../models/Application'

export default function BoardApplications() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { applications, applicationId, userId } = useBoard()

  return (
    <Box height="100vh" background="rgba(0,0,0,0.2)">
      <Box m={2}>
        <Link href={`/board/${userId}`}>
          <a>
            <BoardApplication>
              <Icon as={MdClear} />
            </BoardApplication>
          </a>
        </Link>
      </Box>
      {applications.map((application) => (
        <Box m={2}>
          <Link href={`/board/${userId}/${application.id}`}>
            <a>
              <BoardApplication>
                {application.iconFileName === '' ? (
                  <Box textAlign="center">{application.name}</Box>
                ) : (
                  <Image src={getIconUrl(application)} />
                )}
              </BoardApplication>
            </a>
          </Link>
        </Box>
      ))}
      <Button onClick={toggleColorMode}>Toggle</Button>
    </Box>
  )
}
