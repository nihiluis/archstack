import React, { Suspense } from "react"

import {
  graphql,
  useLazyLoadQuery,
} from "react-relay/hooks"
import { DocumentQuery } from "./__generated__/DocumentQuery.graphql"

interface Props {
  documentId: string
}

export default function Document(props: Props): JSX.Element {
  const data = useLazyLoadQuery<DocumentQuery>(
    graphql`
      query DocumentQuery($id: uuid) {
        document_connection(where: { id: { _eq: $id } }) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    {
      id: props.documentId,
    }
  )

  return (
    <div>
      <Suspense fallback="Loading..."></Suspense>
    </div>
  )
}
