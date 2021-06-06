import { Provider } from 'next-auth/client'
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <RecoilRoot>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </Provider>
  )
}

export default MyApp
