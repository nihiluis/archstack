import "../styles/globals.css"
import "../styles/vars.css"
import "../styles/selectsearch.css"

import graphql from "babel-plugin-relay/macro"
import {
  RelayEnvironmentProvider,
  preloadQuery,
  usePreloadedQuery,
} from "react-relay/hooks"
import RelayEnvironment from "../src/relay/RelayEnvironment"
import { ReactRelayContext } from "react-relay"

import { AuthContext } from "../src/components/Auth"
import { useState, useContext, useEffect } from "react"

import { AuthState } from "../src/components/Auth"
import Head from "next/head"
import { WorkspaceState, WorkspaceContext } from "../src/components/Workspace"

function MyApp({ Component, pageProps }) {
  //const { environment } = useContext(ReactRelayContext)

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
