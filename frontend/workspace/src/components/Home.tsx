import React, { useEffect, useState, useContext } from "react"

import Head from "next/head"

import * as Logo from "../../public/logo.svg"
import { getWorkspaces, Workspace } from "../lib/workspace"
import { SelectSearch } from "../lib/reexports"
import { SITE_TITLE, ENDPOINT_INVENTORY_LOGIN_URL } from "../constants/env"
import { AuthContext } from "./Auth"

interface WorkspaceState {
  error: string
  workspaces: Workspace[]
}

export default function Home() {
  const { auth } = useContext(AuthContext)

  const [workspacesLoading, setWorkspacesLoading] = useState<boolean>(true)
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    error: "",
    workspaces: [],
  })
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      setWorkspacesLoading(true)

      const { workspaces, error } = await getWorkspaces()

      setWorkspacesLoading(false)

      if (workspaces.length > 0) {
        setSelectedWorkspace(workspaces[0].id)
      }

      setWorkspace({ workspaces, error })
    }

    fetchData()
  }, [])

  const workspaces = workspace.workspaces

  const options = workspaces
    .filter(w => w.active || !w.active)
    .map(w => {
      return { name: w.name, value: w.id }
    })

  function handleRedirect(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault()

    if (!workspacesLoading && selectedWorkspace) {
      const url =
        `${ENDPOINT_INVENTORY_LOGIN_URL}?workspaceId=${selectedWorkspace}` +
        `&token=${auth.token}`

      window.location.href = url
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Choose workspace | {SITE_TITLE}</title>
      </Head>
      <div className="container mx-auto mt-8">
        <div className="flex items-center mb-4">
          <Logo style={{ width: 24, height: 24 }} />
          <h2 className="ml-4 title-big">Choose workspace</h2>
        </div>
        <form className="form">
          <div className="mb-8">
            <SelectSearch
              options={options}
              value={selectedWorkspace}
              onChange={value => setSelectedWorkspace(value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleRedirect}>
            Select
          </button>
          {workspace.error && <p className="error">{workspace.error}</p>}
        </form>
      </div>
    </React.Fragment>
  )
}
