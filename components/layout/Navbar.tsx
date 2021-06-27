import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { appTitle } from '../../data/constants'
import AppContainer from './AppContainer'

export default function Navbar() {
  return (
    <Box bgColor={useColorModeValue('blue.200', 'blue.700')}>
      <AppContainer display="flex" py={2}>
        {appTitle}
      </AppContainer>
    </Box>
  )
}
