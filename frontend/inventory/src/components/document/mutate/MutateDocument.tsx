import React, { useEffect, useState, Suspense, useContext } from "react"
import Select from "react-select"

import { graphql, useLazyLoadQuery } from "react-relay/hooks"
import { getIdFromNodeId } from "../../../lib/hasura"
import { DocumentTypesContext } from "../../Workspace"
import {
  MutateDocumentQuery,
  MutateDocumentQueryResponse,
} from "./__generated__/MutateDocumentQuery.graphql"
import { stringify } from "querystring"
import { group } from "console"
import Input from "../../ui/input"

interface Props {
  documentId: string
}

const query = graphql`
  query MutateDocumentQuery($id: uuid) {
    document_type_connection(where: { id: { _eq: $id } }) {
      edges {
        node {
          groups_connection {
            edges {
              node {
                id
                name
                sections_connection {
                  edges {
                    node {
                      id
                      name
                      fields_connection {
                        edges {
                          node {
                            field {
                              id
                              name
                              field_type {
                                id
                                metadata
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
      }
    }
  }
`

type Groups = MutateDocumentQueryResponse["document_type_connection"]["edges"][number]["node"]["groups_connection"]["edges"]

export default function MutateDocument(props: Props): JSX.Element {
  const { types } = useContext(DocumentTypesContext)
  const [selectedType, setSelectedType] = useState<{
    value: string
    label: string
  } | null>(null)
  const data = useLazyLoadQuery<MutateDocumentQuery>(query, {
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
            <Group node={group.node} />
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

type Group = Groups[number]["node"]

interface GroupProps {
  node: Group
}

function Group(props: GroupProps): JSX.Element {
  const { node } = props

  return (
    <div key={`group-${node.id}`}>
      <h2>{node.name}</h2>
      <div>
        {node.sections_connection.edges.map(section => (
          <Section node={section.node} />
        ))}
      </div>
    </div>
  )
}

type Section = Group["sections_connection"]["edges"][number]["node"]

interface SectionProps {
  node: Section
}

function Section(props: SectionProps): JSX.Element {
  const { node } = props

  return (
    <div key={`section-${node.id}`}>
      <h3>{node.name}</h3>
      <div>
        {node.fields_connection.edges.map(field => (
          <Field field={field.node.field} />
        ))}
      </div>
    </div>
  )
}

type Field = Section["fields_connection"]["edges"][number]["node"]["field"]

interface FieldProps {
  field: Field
}

function Field(props: FieldProps): JSX.Element {
  const { field } = props

  return (
    <div key={`field-${field.id}`}>
      <h4>{field.name}</h4>
      <Input type="text" value="" name={`${field.id}`} />
    </div>
  )
}
