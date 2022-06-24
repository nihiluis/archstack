import "../styles/globals.css"
import "../styles/selectsearch.css"
import { AuthContext } from "../src/components/Auth"
import { useState } from "react"

import { AuthState } from "../src/components/Auth"
import Head from "next/head"

function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    error: "",
    token: "",
  })

  const authContextValue = { auth, setAuth }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Head>
        <title>Workspace selection | Archstack</title>
      </Head>
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}

export default MyApp
