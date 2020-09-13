import axios from "axios"
import { ENDPOINT_GET_WORKSPACE_URL, WORKSPACE_API_URL } from "../constants/env"
import protect from "await-protect"
import { Workspace } from "archstack-core/lib/@types"

interface GetWorkspaceResult {
  id: string
  error: string
  workspace?: Workspace
}

export async function getWorkspace(id: string): Promise<GetWorkspaceResult> {
  const headers: any = { "Archstack-Workspace": id }

  const [res, error] = await protect(
    axios.get(ENDPOINT_GET_WORKSPACE_URL, { headers, withCredentials: true })
  )

  if (error) {
    return { id, error: error.message }
  }

  const workspace: Workspace = res.data.workspace
  if (typeof workspace !== "object" || !workspace) {
    return { id, error: "Unable to find workspace in API response" }
  }

  if (!workspace.hasOwnProperty("id")) {
    return { id, error: "API response data seems to be corrupted" }
  }

  return { id, workspace, error: "" }
}

const WORKSPACE_LOCAL_STORAGE_KEY = "workspace"

export function getLocalWorkspaceId(): string {
  return localStorage.getItem(WORKSPACE_LOCAL_STORAGE_KEY) || ""
}

export function setLocalWorkspaceId(id: string) {
  localStorage.setItem(WORKSPACE_LOCAL_STORAGE_KEY, id)
}
