import {
  Box,
  Flex,
  IconButton,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { MdEdit } from 'react-icons/md'
import { useAuthentication } from '../../hooks/authentication'
import { useBoard } from '../../hooks/board'
import { getIconUrl } from '../../models/Application'

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
        <Flex alignItems="center" ml={4}>
          {application.iconFileName !== '' && (
            <Image
              src={getIconUrl(application)}
              width={8}
              height={8}
              mr={2}
              borderRadius={4}
            />
          )}
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
        </Flex>
      )}
    </Flex>
  )
}