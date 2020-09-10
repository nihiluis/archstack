import protect from "await-protect"
import axios from "axios"
import { ENDPOINT_WORKSPACES_URL } from "../constants/env"

export interface Workspace {
  id: string
  name: string
  active: boolean
  users: null
}

interface WorkspacesResponse {
  workspaces: Workspace[]
}

interface WorkspacesResult {
  success: boolean
  error: string
  workspaces: Workspace[]
}

export async function getWorkspaces(): Promise<WorkspacesResult> {
  const [res, error] = await protect(
    axios.get(ENDPOINT_WORKSPACES_URL, { withCredentials: true })
  )

  if (error) {
    return { success: false, error: error.message, workspaces: []}
  }

  const body: WorkspacesResponse = res.data
  const workspaces = body.workspaces || []

  return { success: true, workspaces, error: "" }
}
