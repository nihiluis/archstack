import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
  Suspense,
} from "react"
import Head from "next/head"
//import graphql from "babel-plugin-relay/macro"
import Loading from "./Loading"
import { Workspace } from "archstack-core/lib/@types"
import {
  getWorkspace,
  getLocalWorkspaceId,
  setLocalWorkspaceId,
} from "../lib/workspace"
import { WORKSPACE_SELECTION_URL, IS_SERVER } from "../constants/env"
import { useRouter } from "next/router"
import { AuthContext } from "./Auth"
import { useFragment, useLazyLoadQuery, graphql } from "react-relay/hooks"
import {
  WorkspaceQuery,
  WorkspaceQueryResponse,
} from "./__generated__/WorkspaceQuery.graphql"
import dynamic from "next/dynamic"
import withRelay from "../relay/withRelay"

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
  require?: boolean
}

export const DocumentTypesContext = React.createContext<WorkspaceQueryResponse>(
  undefined
)

export default dynamic(() => Promise.resolve(withRelay(WorkspaceComponent)), {
  ssr: false,
})

function WorkspaceComponent({
  workspaceId: workspaceIdTmp,
  require = true,
  children,
}: PropsWithChildren<Props>) {
  const { workspace, setWorkspace } = useContext(WorkspaceContext)
  const [workspaceLoading, setWorkspaceLoading] = useState<boolean>(true)

  const workspaceId = workspaceIdTmp || getLocalWorkspaceId()

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
      {hasWorkspace && !workspaceLoading && require && (
        <WorkspaceContent>{children}</WorkspaceContent>
      )}
      {workspaceLoading && <Loading />}
    </React.Fragment>
  )
}

function WorkspaceContent(props: PropsWithChildren<{}>): JSX.Element {
  // somehow the downloaded schema doesnt have a document_type_connection, but document_types..?

  let data = useLazyLoadQuery<WorkspaceQuery>(
    graphql`
      query WorkspaceQuery {
        document_type_connection {
          edges {
            node {
              id
              external_id
              name
              ...FilterSidebar_document_types
            }
            cursor
          }
        }
      }
    `,
    {}
  )

  //const [documentTypes, setDocumentTypes] = useState(data)

  return (
    <Suspense fallback={"Loading..."}>
      <DocumentTypesContext.Provider value={data}>
        {props.children}
      </DocumentTypesContext.Provider>
    </Suspense>
  )
}
