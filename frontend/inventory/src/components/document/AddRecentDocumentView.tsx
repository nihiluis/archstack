import React, { useEffect, useContext } from "react"
import { WorkspaceContext } from "../Workspace"
import { AuthContext } from "../Auth"
import {
  AddDocumentViewMutation,
  AddDocumentViewMutationVariables,
} from "./__generated__/AddDocumentViewMutation.graphql"
import {
  ConnectionHandler,
  ROOT_ID,
  graphql,
  generateUniqueClientID,
} from "relay-runtime"
import * as uuid from "uuid"
import { useMutation } from "react-relay/hooks"
import { UseMutationConfig } from "react-relay/lib/relay-experimental/useMutation"

interface Props {
  documentId: string
}

export default function AddDocumentView(props: Props): JSX.Element {
  const { workspace } = useContext(WorkspaceContext)
  const { auth } = useContext(AuthContext)

  const [commit, _] = useMutation<AddDocumentViewMutation>(graphql`
    mutation AddRecentDocumentViewMutation(
      $workspace_id: uuid
      $user_id: uuid
      $document_id: uuid
    ) {
      insert_recently_viewed_document_one(
        object: {
          user_id: $user_id
          workspace_id: $workspace_id
          document_id: $document_id
        }
      ) {
        id
        timestamp
        document {
          id
          name
          parent {
            id
            name
          }
          type {
            id
            name
            color
          }
        }
      }
    }
  `)

  useEffect(() => {
    const mutationConfig: UseMutationConfig<AddDocumentViewMutation> = {
      variables: {
        workspace_id: workspace.id,
        user_id: auth.userId,
        document_id: props.documentId,
      },
      updater: store => {
        const baseRecord = store.get(ROOT_ID)

        const connectionName =
          "RightSidebarQuery_recently_viewed_document_connection"

        const connectionRecord = ConnectionHandler.getConnection(
          baseRecord,
          connectionName,
          { order_by: { timestamp: "desc" } }
        )

        if (!connectionRecord) {
          throw Error("connectionRecord may not be empty")
        }

        const payload = store.getRootField(
          "insert_recently_viewed_document_one"
        )

        //const newRecord = store.create(id, "recently_viewed_document")

        const newEdge = ConnectionHandler.createEdge(
          store,
          connectionRecord,
          payload,
          "recently_viewed_documentEdge"
        )

        newEdge.setValue(uuid.v4().toString(), "cursor")

        ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge)
      },
    }

    commit(mutationConfig)
  }, [props.documentId])

  return null
}
