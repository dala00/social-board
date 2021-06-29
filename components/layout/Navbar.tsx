import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { appTitle } from '../../data/constants'
import AppContainer from './AppContainer'
import ColorModeButton from './parts/ColorModeButton'

export default function Navbar() {
  return (
    <Box bgColor={useColorModeValue('blue.200', 'blue.700')}>
      <AppContainer
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py={2}
      >
        <Flex>{appTitle}</Flex>
        <Flex>
          <ColorModeButton />
        </Flex>
      </AppContainer>
    </Box>
  )
}
