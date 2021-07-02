import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const styles = {
  global: (props) => ({
    body: {
      bg: mode('gray.100', 'gray.800')(props),
    },
  }),
}

const theme = extendTheme({ config, styles })

export default theme
