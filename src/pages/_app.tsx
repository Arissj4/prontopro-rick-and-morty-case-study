import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import Navbar from '../components/navbar'

const App = ({ Component, pageProps }: AppProps) => {
  return(
    <>
      <div className='w-md m-auto h-screen'>
        <Navbar />

        <main className="pt-17.5">
          <Component {...pageProps}/>
        </main>
      </div>
    </>
  )
}

export default App
