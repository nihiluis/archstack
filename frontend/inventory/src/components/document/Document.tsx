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
              created_at
              description
              external_id
              name
              type {
                color
                description
                created_at
                external_id
                id
                name
                updated_at
                fields_connection {
                  edges {
                    node {
                      description
                      created_at
                      id
                      mandatory
                      name
                      order
                      updated_at
                      field_type
                      external_id
                      field_values_connection(where: {document: {id: {_eq: $id}}}, first: 1) {
                        edges {
                          node {
                            id
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
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
