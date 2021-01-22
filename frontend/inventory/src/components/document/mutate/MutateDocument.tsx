import React, {
  useEffect,
  useState,
  Suspense,
  useContext,
  PropsWithChildren,
} from "react"
import Select from "react-select"

import { graphql, useLazyLoadQuery, useMutation } from "react-relay/hooks"
import { getIdFromNodeId } from "../../../lib/hasura"
import { DocumentTypesContext, WorkspaceContext } from "../../Workspace"
import {
  MutateDocumentQuery,
  MutateDocumentQueryResponse,
} from "./__generated__/MutateDocumentQuery.graphql"
import Field from "./field"
import { Formik, FormikProps } from "formik"
import Button from "../../ui/Button"
import Line from "../../ui/Line"
import {
  field_value_insert_input,
  MutateDocumentMutation,
} from "./__generated__/MutateDocumentMutation.graphql"
import { UseMutationConfig } from "react-relay/lib/relay-experimental/useMutation"

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
    parentData: document_connection(
      where: { type: { id: { _eq: $type_id } } }
    ) {
      edges {
        node {
          id
          name
          parent {
            id
            name
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

const mutation = graphql`
  mutation MutateDocumentMutation(
    $id: uuid!
    $name: String!
    $description: String!
    $external_id: String!
    $parent_id: uuid!
    $type_id: uuid!
    $field_values: [field_value_insert_input!]!
  ) {
    insert_document_one(
      object: {
        id: $id
        name: $name
        description: $description
        external_id: $external_id
        parent_id: $parent_id
        type_id: $type_id
        field_values: {
          data: $field_values
          on_conflict: {
            constraint: document_field_values_field_id_document_id_key
            update_columns: value
          }
        }
      }
      on_conflict: {
        constraint: document_pkey
        update_columns: [name, description, external_id, parent_id]
      }
    ) {
      id
    }
  }
`

type Groups = MutateDocumentQueryResponse["document_type_connection"]["edges"][number]["node"]["groups_connection"]["edges"]
type FieldValues = MutateDocumentQueryResponse["document_connection"]["edges"][number]["node"]["field_values_connection"]["edges"]

interface FormValues {
  name: string
  description: string
  external_id: string
  parent?: string
  [key: string]: string
}

/**
 * Ideas:
 * - collapsible
 *
 * @param props
 */
export default function MutateDocument(props: Props): JSX.Element {
  const { workspace } = useContext(WorkspaceContext)
  const { types } = useContext(DocumentTypesContext)

  const [selectedType, setSelectedType] = useState<{
    value: string
    label: string
  } | null>(null)
  const data = useLazyLoadQuery<MutateDocumentQuery>(query, {
    document_id: props.documentId || null,
    type_id: selectedType ? getIdFromNodeId(selectedType.value) : null,
  })

  const [commit, _] = useMutation<MutateDocumentMutation>(mutation)

  const typeData =
    data.document_type_connection.edges.length === 1
      ? data.document_type_connection.edges[0].node
      : null

  const documentData =
    data.document_connection.edges.length === 1
      ? data.document_connection.edges[0].node
      : null

  const possibleParents = data.parentData.edges.map(edge => edge.node)

  const groups: Groups = typeData?.groups_connection.edges ?? []
  const fieldValues: FieldValues =
    documentData?.field_values_connection.edges ?? []

  const allFields = groups.flatMap(group =>
    group.node.sections_connection.edges.flatMap(
      section => section.node.fields_connection.edges
    )
  )

  const initialFormValues: FormValues = {
    name: "",
    description: "",
    external_id: "",
    parent: null,
  }

  allFields.forEach(field => {
    if (field.node.field.field_type.type === "string") {
      initialFormValues[field.node.field.id] = ""
    } else {
      initialFormValues[field.node.field.id] = null
    }
  })

  fieldValues.forEach(
    fieldValue =>
      (initialFormValues[fieldValue.node.field.id] = fieldValue.node.value)
  )

  const options = types.map(type => {
    return { value: type.node.id, label: type.node.name }
  })

  function validate(values: FormValues): any {
    const errors = {}
  }

  function submit(values: FormValues) {
    const fieldValues: field_value_insert_input[] = Object.entries(values)
      .filter(
        ([fieldId, fieldValue]) =>
          ["name", "description", "parent"].indexOf(fieldId) === -1
      )
      .map(([fieldId, fieldValue]) => {
        return { field_id: fieldId, value: fieldValue }
      })

    const mutationConfig: UseMutationConfig<MutateDocumentMutation> = {
      variables: {
        id: documentData ? getIdFromNodeId(documentData.id) : null,
        external_id: values["external_id"],
        name: values["name"],
        description: values["description"],
        type_id: selectedType.value,
        parent_id: values["parent"],
        field_values: fieldValues,
      },
    }

    commit(mutationConfig)
  }

  return (
    <React.Fragment>
      <h1 className="mb-2 text-4xl">Create document</h1>
      <div className="content">
        <h2 className="mb-2">Type</h2>
        <Select
          className="w-48"
          options={options}
          value={selectedType}
          onChange={setSelectedType}
        />
        <Line className="mt-4 mb-2" />
        <Formik<FormValues>
          initialValues={initialFormValues}
          validate={validate}
          onSubmit={submit}>
          {formikProps => (
            <div>
              <Group id="general" name="General">
                <Field
                  id="name"
                  name="Name"
                  fieldType="string"
                  fieldTypeMetadata={{ maxLength: 24 }}
                  value={formikProps.values["name"]}
                  handleChange={value =>
                    formikProps.setFieldValue("name", value)
                  }
                />
                <Field
                  id="external_id"
                  name="External ID"
                  fieldType="string"
                  fieldTypeMetadata={{ maxLength: 24 }}
                  value={formikProps.values["external_id"]}
                  handleChange={value =>
                    formikProps.setFieldValue("external_id", value)
                  }
                />
                <Field
                  id="description"
                  name="Description"
                  fieldType="string"
                  fieldTypeMetadata={{ maxLength: 240 }}
                  value={formikProps.values["description"]}
                  handleChange={value =>
                    formikProps.setFieldValue("description", value)
                  }
                />
              </Group>
              <GroupLineBreak />
              <Group id="hierarchy" name="Hierarchy">
                <Field
                  id="parent"
                  name="Parent"
                  fieldType="relation"
                  relationObjects={selectedType ? possibleParents : []}
                  fieldTypeMetadata={{}}
                  value={formikProps.values["parent"]}
                  handleChange={value =>
                    formikProps.setFieldValue("parent", value)
                  }
                />
              </Group>
              {selectedType && (
                <React.Fragment>
                  {groups.length > 0 && <GroupLineBreak />}
                  {groups.map((group, idx) => (
                    <React.Fragment key={`fragment-${group.node.id}`}>
                      <Group
                        key={`${group.node.id}`}
                        id={group.node.id}
                        name={group.node.name}>
                        {group.node.sections_connection.edges.map(section => (
                          <Section
                            key={`section-${section.node.id}`}
                            id={section.node.id}
                            name={section.node.name}>
                            {section.node.fields_connection.edges.map(field => {
                              const id = field.node.field.id
                              const name = field.node.field.name
                              const fieldType = field.node.field.field_type.type
                              const fieldTypeMetadata =
                                field.node.field.field_type.metadata

                              return (
                                <Field
                                  key={`field-${id}`}
                                  id={id}
                                  fieldType={fieldType}
                                  fieldTypeMetadata={fieldTypeMetadata}
                                  name={name}
                                  value={formikProps.values[id]}
                                  handleChange={value =>
                                    formikProps.setFieldValue(id, value)
                                  }
                                />
                              )
                            })}
                          </Section>
                        ))}
                      </Group>
                      {idx !== groups.length - 1 && <GroupLineBreak />}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )}
              <GroupLineBreak />
              <Button name="form-submit" type="submit" className="w-1/3" disabled={!selectedType}>
                <h4>Create</h4>
              </Button>
            </div>
          )}
        </Formik>
      </div>
    </React.Fragment>
  )
}

type Group = Groups[number]["node"]

interface GroupProps extends PropsWithChildren<{}> {
  id: string
  name: string
}

function Group(props: GroupProps): JSX.Element {
  const { children, id, name } = props

  return (
    <div key={`group-${id}`}>
      <h2 className="mb-2">{name}</h2>
      <div>{children}</div>
    </div>
  )
}

export type Section = Group["sections_connection"]["edges"][number]["node"]

interface SectionProps extends PropsWithChildren<{}> {
  id: string
  name: string
}

function Section(props: SectionProps): JSX.Element {
  const { id, name, children } = props

  return (
    <div key={`section-${id}`} className="mb-4">
      <h3 className="mb-1">{name}</h3>
      <div>{children}</div>
    </div>
  )
}

function GroupLineBreak(): JSX.Element {
  return <Line className="mt-4 mb-4" />
}
