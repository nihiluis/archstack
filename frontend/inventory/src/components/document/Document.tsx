import React, { Suspense } from "react"

import { graphql, useLazyLoadQuery } from "react-relay/hooks"
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
                      field_values_connection(
                        where: { document: { id: { _eq: $id } } }
                        first: 1
                      ) {
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

  const hasDocument = data.document_connection.edges.length === 1
  const documentData = hasDocument
    ? data.document_connection.edges[0].node
    : null

  return (
    <React.Fragment>
      {!hasDocument && (
        <p className="text-error">Unable to find this document.</p>
      )}
      {hasDocument && (
        <div className="mb-2 flex">
          <h1 className="font-semibold mb-1 text-xl">{documentData.name}</h1>
          <div
            className="rounded-full py-1 px-2 text-white table ml-4"
            style={{ backgroundColor: documentData.type.color }}>
            {documentData.type.name}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
