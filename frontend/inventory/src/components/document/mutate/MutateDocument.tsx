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
import Field from "./field"
import { Formik, FormikProps } from "formik"
import Button from "../../ui/Button"

interface Props {
  documentId?: string
}

const query = graphql`
  query MutateDocumentQuery($document_id: uuid, $type_id: uuid) {
    document_connection(where: { id: { _eq: $document_id } }) {
      edges {
        node {
          id
          name
          field_values_connection {
            edges {
              node {
                id
                value
                field {
                  id
                }
              }
            }
          }
        }
      }
    }
    document_type_connection(where: { id: { _eq: $type_id } }) {
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
                                type
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
type FieldValues = MutateDocumentQueryResponse["document_connection"]["edges"][number]["node"]["field_values_connection"]["edges"]

interface FormValues {
  [key: string]: string
}

export default function MutateDocument(props: Props): JSX.Element {
  const { types } = useContext(DocumentTypesContext)
  const [selectedType, setSelectedType] = useState<{
    value: string
    label: string
  } | null>(null)
  const data = useLazyLoadQuery<MutateDocumentQuery>(query, {
    document_id: props.documentId || null,
    type_id: selectedType ? getIdFromNodeId(selectedType.value) : null,
  })

  const typeData =
    data.document_type_connection.edges.length === 1
      ? data.document_type_connection.edges[0].node
      : null

  const documentData =
    data.document_connection.edges.length === 1
      ? data.document_connection.edges[0].node
      : null

  const groups: Groups = typeData?.groups_connection.edges ?? []
  const fieldValues: FieldValues =
    documentData?.field_values_connection.edges ?? []

  const allFields = groups.flatMap(group =>
    group.node.sections_connection.edges.flatMap(
      section => section.node.fields_connection.edges
    )
  )

  const initialFormValues: FormValues = {}

  allFields.forEach(field => (initialFormValues[field.node.field.id] = null))
  fieldValues.forEach(
    fieldValue =>
      (initialFormValues[fieldValue.node.field.id] = fieldValue.node.value)
  )

  const options = types.map(type => {
    return { value: type.node.id, label: type.node.name }
  })

  function submit(values: FormValues) {}

  return (
    <React.Fragment>
      <div>
        <Select
          options={options}
          value={selectedType}
          onChange={setSelectedType}
        />
        {selectedType && (
          <Formik<FormValues>
            initialValues={initialFormValues}
            onSubmit={submit}>
            {formikProps => (
              <div>
                {groups.map(group => (
                  <Group {...formikProps} node={group.node} />
                ))}
                <Button name="form-submit" type="submit" />
              </div>
            )}
          </Formik>
        )}
      </div>
    </React.Fragment>
  )
}

type Group = Groups[number]["node"]

interface GroupProps extends FormikProps<FormValues> {
  node: Group
}

function Group(props: GroupProps): JSX.Element {
  const { node, ...formikProps } = props

  return (
    <div key={`group-${node.id}`}>
      <h2>{node.name}</h2>
      <div>
        {node.sections_connection.edges.map(section => (
          <Section {...formikProps} node={section.node} />
        ))}
      </div>
    </div>
  )
}

export type Section = Group["sections_connection"]["edges"][number]["node"]

interface SectionProps extends FormikProps<FormValues> {
  node: Section
}

function Section(props: SectionProps): JSX.Element {
  const { node, ...formikProps } = props

  return (
    <div key={`section-${node.id}`}>
      <h3>{node.name}</h3>
      <div>
        {node.fields_connection.edges.map(field => {
          const id = field.node.field.id

          return (
            <Field
              field={field.node.field}
              name={id}
              value={formikProps.values[id]}
              handleChange={value => formikProps.setFieldValue(id, value)}
            />
          )
        })}
      </div>
    </div>
  )
}
