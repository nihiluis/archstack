import "../styles/globals.css"
import { AuthContext } from "../src/components/Auth"
import { useState } from "react"

import { AuthState } from "../src/components/Auth"

function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    error: "",
    token: "",
  })

  const authContextValue = { auth, setAuth }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}

export default MyApp
