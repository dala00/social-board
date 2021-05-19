import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </RecoilRoot>
  )
}

export default MyApp
