import React, { useEffect, useState } from "react"

import Head from "next/head"

import * as Logo from "../../public/logo.svg"
import { getWorkspaces, Workspace } from "../lib/workspace"
import { SelectSearch } from "../lib/reexports"
import { SITE_TITLE } from "../constants/env"

interface WorkspaceState {
  error: string
  workspaces: Workspace[]
}

export default function Home() {
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
        <div className="form">
          <div className="mb-8">
            <SelectSearch
              options={options}
              value={selectedWorkspace}
              onChange={value => setSelectedWorkspace(value)}
            />
          </div>
          <button className="btn btn-primary">Select</button>
          {workspace.error && <p className="error">{workspace.error}</p>}
        </div>
      </div>
    </React.Fragment>
  )
}
