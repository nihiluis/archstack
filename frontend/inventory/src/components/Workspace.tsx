import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
} from "react"
import Head from "next/head"

import Loading from "./Loading"
import { Workspace } from "archstack-core/lib/@types"
import {
  getWorkspace,
  getLocalWorkspaceId,
  setLocalWorkspaceId,
} from "../lib/workspace"
import { WORKSPACE_SELECTION_URL } from "../constants/env"
import { useRouter } from "next/router"
import { AuthContext } from "./Auth"

interface WorkspaceContextValues {
  workspace: WorkspaceState
  setWorkspace: (state: WorkspaceState) => void
}

export const WorkspaceContext = React.createContext<WorkspaceContextValues>(
  undefined
)

export interface WorkspaceState {
  id: string
  workspace?: Workspace
  error: string
}

interface Props {
  workspaceId?: string
}

export default function WorkspaceWrapper(props: PropsWithChildren<Props>) {
  const { workspace, setWorkspace } = useContext(WorkspaceContext)
  const [workspaceLoading, setWorkspaceLoading] = useState<boolean>(true)

  const workspaceId = props.workspaceId || getLocalWorkspaceId()

  const router = useRouter()

  const { auth } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      if (!workspaceId || typeof workspaceId !== "string") {
        setWorkspace({
          error: "Unable to retrieve workspace id",
          id: "",
        })
      } else if (!workspace.workspace) {
        setWorkspaceLoading(true)

        const { id, workspace, error } = await getWorkspace(workspaceId)

        setWorkspaceLoading(false)

        if (!error && workspace) {
          setLocalWorkspaceId(id)
        }

        setWorkspace({ workspace, id, error })
      } else if (workspaceLoading) {
        setWorkspaceLoading(false)
      }
    }

    fetchData()
  }, [])

  const hasWorkspace = !!workspace.workspace

  useEffect(() => {
    if (!hasWorkspace && !workspaceLoading) {
      window.location.href = WORKSPACE_SELECTION_URL
    }

    if (auth.authenticated && hasWorkspace && router.pathname === "/login") {
      router.push("/")
    }
  }, [workspace])

  return (
    <React.Fragment>
      <Head>{workspaceLoading && <title>Selecting workspace...</title>}</Head>
      {hasWorkspace && !workspaceLoading && props.children}
      {workspaceLoading && <Loading />}
    </React.Fragment>
  )
}
