import "../styles/globals.css"
import "../styles/selectsearch.css"
import { AuthContext } from "../src/components/Auth"
import { useState } from "react"

import { AuthState } from "../src/components/Auth"
import Head from "next/head"
import { WorkspaceState, WorkspaceContext } from "../src/components/Workspace"

function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    error: "",
    token: "",
  })

  const authContextValue = { auth, setAuth }

  const [workspace, setWorkspace] = useState<WorkspaceState>({
    error: "",
    id: "",
  })

  const workspaceContextValue = { workspace, setWorkspace }

  return (
    <AuthContext.Provider value={authContextValue}>
      <WorkspaceContext.Provider value={workspaceContextValue}>
        <Head>
          <title>Inventory | Archstack</title>
        </Head>
        <Component {...pageProps} />
      </WorkspaceContext.Provider>
    </AuthContext.Provider>
  )
}

export default MyApp
