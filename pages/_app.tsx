import { Provider } from 'next-auth/client'
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'
import theme from '../theme/theme'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ChakraProvider>
      </RecoilRoot>
    </Provider>
  )
}

export default MyApp
