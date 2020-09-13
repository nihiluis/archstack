export interface Workspace {
  id: string
  name: string
  active: boolean
  users?: WorkspaceUser[]
  createdAt: number
  updatedAt: number
}

export interface WorkspaceUser {
  id: string
  
  workspaces?: Workspace[]
}
