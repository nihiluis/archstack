import React, { useEffect, useState } from "react"

import Head from "next/head"

import Auth from "../src/components/Auth"
import { SITE_TITLE } from "../src/constants/env"
import * as Logo from "../public/logo.svg"
import { getWorkspaces, Workspace } from "../src/lib/workspace"
import { SelectSearch } from "../src/lib/reexports"

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

  useEffect(() => {
    const fetchData = async () => {
      setWorkspacesLoading(true)

      const { workspaces, error } = await getWorkspaces()

      setWorkspacesLoading(false)

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
    <Auth require>
      <Logo style={{ width: 24, height: 24 }} />
      <h2 className="title-big">Choose workspace</h2>
      <div className="container">
        <SelectSearch
          options={options}
          value={""}
        />
        <button className="btn btn-primary">Select</button>
      </div>
      {workspace.error && <p className="error">{workspace.error}</p>}
    </Auth>
  )
}
