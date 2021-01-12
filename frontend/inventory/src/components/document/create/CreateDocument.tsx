import React, { useEffect, useState, Suspense, useContext } from "react"
import Select from "react-select"

import { graphql, useLazyLoadQuery } from "react-relay/hooks"
import { getIdFromNodeId } from "../../../lib/hasura"
import { DocumentTypesContext } from "../../Workspace"
import {
  CreateDocumentQuery,
  CreateDocumentQueryResponse,
} from "./__generated__/CreateDocumentQuery.graphql"
import { stringify } from "querystring"

interface Props {
  documentId: string
}

const query = graphql`
  query CreateDocumentQuery($id: uuid) {
    document_type_connection(where: { id: { _eq: $id } }) {
      edges {
        node {
          groups_connection {
            edges {
              node {
                id
                sections_connection {
                  edges {
                    node {
                      fields {
                        field {
                          id
                          name
                          field_type
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
  }
`

type Groups = CreateDocumentQueryResponse["document_type_connection"]["edges"][number]["node"]["groups_connection"]["edges"]

export default function CreateDocument(props: Props): JSX.Element {
  const { types } = useContext(DocumentTypesContext)
  const [selectedType, setSelectedType] = useState<{
    value: string
    label: string
  } | null>(null)
  const data = useLazyLoadQuery<CreateDocumentQuery>(query, {
    id: selectedType?.value,
  })

  const typeData =
    data.document_type_connection.edges.length === 1
      ? data.document_type_connection.edges[0].node
      : null

  const groups: Groups = typeData?.groups_connection.edges ?? []

  const options = types.map(type => {
    return { value: type.node.id, label: type.node.name }
  })

  return (
    <React.Fragment>
      <Select
        options={options}
        value={selectedType}
        onChange={setSelectedType}
      />
      {selectedType && (
        <div>
          {groups.map(group => (
            <div key={`group-${group.node.id}`}></div>
          ))}
        </div>
      )}
    </React.Fragment>
  )
}
