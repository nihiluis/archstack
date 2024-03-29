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
import { Workspace } from "../lib/workspace"
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
import { ReactRelayContext } from "react-relay"
import { getRequest, createOperationDescriptor } from "relay-runtime"
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

interface DocumentTypesContextData {
  rawData: WorkspaceQueryResponse
  types: WorkspaceQueryResponse["document_type_connection"]["edges"]
}

export const DocumentTypesContext = React.createContext<DocumentTypesContextData>(
  undefined
)

export default function WorkspaceComponent({
  workspaceId: workspaceIdTmp,
  require = true,
  children,
}: PropsWithChildren<Props>) {
  const { workspace, setWorkspace } = useContext(WorkspaceContext)
  const [workspaceLoading, setWorkspaceLoading] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)

  const workspaceId = workspaceIdTmp || getLocalWorkspaceId()

  const router = useRouter()

  const { auth } = useContext(AuthContext)

  useEffect(() => {
    let isCancelled = false

    const fetchData = async () => {
      if (!workspaceId || typeof workspaceId !== "string") {
        setWorkspace({
          error: "Unable to retrieve workspace id",
          id: "",
        })
      } else if (!workspace.workspace) {
        setWorkspaceLoading(true)

        const { id, workspace, error } = await getWorkspace(workspaceId)

        if (!isCancelled) {
          setWorkspaceLoading(false)

          if (!error && workspace) {
            setLocalWorkspaceId(id)
          }

          setWorkspace({ workspace, id, error })
        }
      } else if (workspaceLoading) {
        setWorkspaceLoading(false)
      }
    }

    fetchData()

    setInitialized(true)

    return () => {
      isCancelled = true
    }
  }, [])

  const hasWorkspace = !!workspace.workspace

  useEffect(() => {
    if (!hasWorkspace && !workspaceLoading && initialized) {
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
        <WorkspaceContentWrapper>{children}</WorkspaceContentWrapper>
      )}
      {workspaceLoading && <Loading />}
    </React.Fragment>
  )
}

const WorkspaceContentWrapper = withRelay(WorkspaceContent)

export type WorkspaceDocumentType = WorkspaceQueryResponse["document_type_connection"]["edges"][0]

function WorkspaceContent(props: PropsWithChildren<{}>): JSX.Element {
  // somehow the downloaded schema doesnt have a document_type_connection, but document_types..?

  const query = graphql`
    query WorkspaceQuery {
      document_type_connection(order_by: { name: asc }) {
        edges {
          node {
            id
            external_id
            name
            color
            sub_type_of {
              id
              color
            }
            sub_types_connection {
              edges {
                node {
                  id
                }
              }
            }
            ...FilterSidebar_document_types
          }
          cursor
        }
      }
    }
  `

  const queryRequest = getRequest(query)
  const queryDescriptor = createOperationDescriptor(queryRequest, {})

  const data = useLazyLoadQuery<WorkspaceQuery>(query, {})

  const idTypeMap: { [key: string]: WorkspaceDocumentType } = {}
  for (let edge of data.document_type_connection.edges) {
    idTypeMap[edge.node.id] = edge
  }

  const rootTypes = data.document_type_connection.edges
    .slice()
    .filter(edge => !edge.node.sub_type_of)
  const types = rootTypes.slice()

  function insertSubTypes(type: WorkspaceDocumentType) {
    if (type.node.sub_types_connection.edges.length > 0) {
      let idx = types.indexOf(type) + 1

      for (let edge of type.node.sub_types_connection.edges) {
        const subType = idTypeMap[edge.node.id]
        types.splice(idx, 0, subType)

        insertSubTypes(subType)
        idx += subType.node.sub_types_connection.edges.length

        idx++
      }
    }
  }

  for (let type of rootTypes) {
    insertSubTypes(type)
  }

  const { environment } = useContext(ReactRelayContext)

  useEffect(() => {
    environment.retain(queryDescriptor)
  }, [])

  //const [documentTypes, setDocumentTypes] = useState(data)

  return (
    <DocumentTypesContext.Provider value={{ rawData: data, types }}>
      {props.children}
    </DocumentTypesContext.Provider>
  )
}
