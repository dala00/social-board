import { Box, Flex, IconButton, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { MdEdit } from 'react-icons/md'
import { useAuthentication } from '../../hooks/authentication'
import { useBoard } from '../../hooks/board'

export default function BoardHeader() {
  const { applicationId, getApplication, user } = useBoard()
  const { currentUser } = useAuthentication()
  const application = applicationId ? getApplication(applicationId) : undefined

  return (
    <Flex
      alignItems="center"
      background={useColorModeValue('gray.100', 'gray.700')}
      padding={2}
    >
      <Box>{user.name}</Box>
      {application && (
        <Box ml={4}>
          {application.name}
          {currentUser.id === user.id && (
            <Link href={`/applications/${application.id}/edit`}>
              <IconButton
                aria-label="Edit"
                icon={<MdEdit />}
                isRound={true}
                ml={2}
              />
            </Link>
          )}
        </Box>
      )}
    </Flex>
  )
}
