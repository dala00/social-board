import { Box, useColorModeValue } from '@chakra-ui/react'

const size = 16

export default function BoardApplication({ children }) {
  return (
    <Box
      border="1px"
      borderColor="grey.100"
      borderRadius={4}
      background={useColorModeValue('whiteAlpha.800', 'whiteAlpha.400')}
      display="grid"
      placeItems="center"
      width={size}
      height={size}
    >
      {children}
    </Box>
  )
}
