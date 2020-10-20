import React, { useEffect, useContext } from "react"
import { useMutation, graphql } from "react-relay/hooks"
import { WorkspaceContext } from "../Workspace"
import { AuthContext } from "../Auth"
import { AddDocumentViewMutation } from "./__generated__/AddDocumentViewMutation.graphql"

interface Props {
  documentId: string
}

export default function AddDocumentView(props: Props): JSX.Element {
  const { workspace } = useContext(WorkspaceContext)
  const { auth } = useContext(AuthContext)

  const [commit, _] = useMutation<AddDocumentViewMutation>(graphql`
    mutation AddDocumentViewMutation(
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
        timestamp
        document_id
        id
      }
    }
  `)

  useEffect(() => {
    const mutationConfig = {
      variables: {
        workspace_id: workspace.id,
        user_id: auth.userId,
        document_id: props.documentId,
      },
    }

    commit(mutationConfig)
  }, [])

  return null
}
