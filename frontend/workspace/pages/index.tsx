import React, { useEffect, useState } from "react"

import Head from "next/head"

import Auth from "../src/components/Auth"
import { SITE_TITLE } from "../src/constants/env"
import * as Logo from "../public/logo.svg"
import { getWorkspaces, Workspace } from "../src/lib/workspace"
import { SelectSearch } from "../src/lib/reexports"
import Home from "../src/components/Home"

interface WorkspaceState {
  error: string
  workspaces: Workspace[]
}

export default function Index() {
  const [workspacesLoading, setWorkspacesLoading] = useState<boolean>(true)
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    error: "",
    workspaces: [],
  })
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      setWorkspacesLoading(true)

      const { workspaces, error } = await getWorkspaces("")

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
    <Auth require>
      <Home />
    </Auth>
  )
}
