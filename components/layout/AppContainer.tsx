import { Container } from '@chakra-ui/react'
import React from 'react'

export default function AppContainer({ children, ...props }) {
  return (
    <Container maxW="container.md" {...props}>
      {children}
    </Container>
  )
}
