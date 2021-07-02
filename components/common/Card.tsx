import { Box } from '@chakra-ui/react'
import React, { ComponentProps } from 'react'

type Props = {
  children: React.ReactNode
} & ComponentProps<typeof Box>

export default function Card(props: Props) {
  const { children, ...others } = props

  return (
    <Box backgroundColor="white" borderRadius={10} padding={4} {...others}>
      {children}
    </Box>
  )
}
