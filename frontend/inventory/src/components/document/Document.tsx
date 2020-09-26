import React, { Suspense } from "react"

import { graphql, useLazyLoadQuery, useFragment } from "react-relay/hooks"
import { DocumentQuery } from "./__generated__/DocumentQuery.graphql"
import { DocumentField_field$key } from "./__generated__/DocumentField_field.graphql"

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
                      id
                      ...DocumentField_field
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
        <div>
          <div className="mb-2 flex">
            <h1 className="font-semibold mb-1 text-xl">{documentData.name}</h1>
            <div
              className="rounded-full py-1 px-2 text-white table ml-4"
              style={{ backgroundColor: documentData.type.color }}>
              {documentData.type.name}
            </div>
          </div>
          <div>
            {(documentData.type.fields_connection?.edges ?? []).map(e => (
              <DocumentField
                key={`DocumentField-${e.node.id}`}
                field={e.node}
              />
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

interface FieldProps {
  field: DocumentQuery["response"]["document_connection"]["edges"][0]["node"]["type"]["fields_connection"]["edges"][0]["node"]
}

function DocumentField(props: FieldProps) {
  const data = useFragment<DocumentField_field$key>(
    graphql`
      fragment DocumentField_field on document_field {
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
    `,
    props.field
  )

  const value =
    data.field_values_connection.edges.length > 0
      ? data.field_values_connection.edges[0].node
      : null

  return (
    <div>
      <p>{data.name}</p>
      <p>{value?.value ?? "-"}</p>
    </div>
  )
}
