import { Box } from '@chakra-ui/react'
import React from 'react'
import AppContainer from './AppContainer'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <Box>
      <Navbar />
      <AppContainer py={2}>
        <Box my={2}>{children}</Box>
      </AppContainer>
    </Box>
  )
}
