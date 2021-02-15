import "../styles/globals.css"
import "../styles/vars.css"
import "../styles/selectsearch.css"

import { ReactRelayContext } from "react-relay"

import { AuthContext } from "../src/components/Auth"
import { useState, useContext } from "react"

import { AuthState } from "../src/components/Auth"
import Head from "next/head"
import { WorkspaceState, WorkspaceContext } from "../src/components/Workspace"
import { IS_SERVER } from "../src/constants/env"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { useEnvironment } from "../src/relay/relay"

function InventoryApp({ Component, pageProps }) {
  const environment = useEnvironment()

  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    error: "",
    token: "",
    userId: "",
  })

  const authContextValue = { auth, setAuth }

  const [workspace, setWorkspace] = useState<WorkspaceState>({
    error: "",
    id: "",
  })

  const workspaceContextValue = { workspace, setWorkspace }

  return (
    <RelayEnvironmentProvider environment={environment}>
      <AuthContext.Provider value={authContextValue}>
        <WorkspaceContext.Provider value={workspaceContextValue}>
          <Head>
            <title>Inventory | Archstack</title>
          </Head>
          <Component {...pageProps} />
        </WorkspaceContext.Provider>
      </AuthContext.Provider>
    </RelayEnvironmentProvider>
  )
}

export default InventoryApp
