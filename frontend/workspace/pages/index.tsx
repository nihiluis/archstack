import React, { useEffect, useState } from "react"

import Head from "next/head"

import Auth from "../src/components/Auth"
import { SITE_TITLE } from "../src/constants/env"
import * as Logo from "../public/logo.svg"
import { getWorkspaces, Workspace } from "../src/lib/workspace"

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

  return (
    <Auth require>
      <Logo style={{ width: 24, height: 24 }} />
      {workspace.workspaces.map(w => w.name)}
      {workspace.error && <p className="error">{workspace.error}</p>}
    </Auth>
  )
}
