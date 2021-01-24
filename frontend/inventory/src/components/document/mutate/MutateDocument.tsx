import React, {
  useEffect,
  useState,
  Suspense,
  useContext,
  PropsWithChildren,
} from "react"
import Select from "react-select"
import * as Yup from "yup"

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
import { mutation, query } from "./gql"
import { createSchema } from "./schema"
import ErrorText from "../../error/ErrorText"

interface Props {
  documentId?: string
}

type Groups = MutateDocumentQueryResponse["document_type_connection"]["edges"][number]["node"]["groups_connection"]["edges"]
export type Fields = Groups[number]["node"]["sections_connection"]["edges"][number]["node"]["fields_connection"]["edges"]
type FieldValues = MutateDocumentQueryResponse["document_connection"]["edges"][number]["node"]["field_values_connection"]["edges"]

export interface FormValues {
  name: string
  description: string
  external_id: string
  parent?: string
  [key: string]: any
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

  const [validationSchema, setValidationSchema] = useState<Yup.BaseSchema>(null)
  const [selectedType, setSelectedType] = useState<{
    value: string
    label: string
  } | null>(null)
  const data = useLazyLoadQuery<MutateDocumentQuery>(query, {
    document_id: props.documentId || null,
    type_id: selectedType?.value,
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

  function getInitialFormValues(): FormValues {
    const initialFormValues: FormValues = {
      name: "",
      description: "",
      external_id: "",
      parent: null,
    }

    allFields.forEach(field => {
      const fieldId = getIdFromNodeId(field.node.field.id)
      const typeString = field.node.field.field_type.type

      if (
        typeString === "string" ||
        typeString === "enum" ||
        typeString === "number"
      ) {
        initialFormValues[fieldId] = ""
      } else {
        initialFormValues[fieldId] = null
      }
    })

    fieldValues.forEach(fieldValue => {
      initialFormValues[getIdFromNodeId(fieldValue.node.field.id)] =
        fieldValue.node.value
    })

    return initialFormValues
  }

  const options = types.map(type => {
    return { value: getIdFromNodeId(type.node.id), label: type.node.name }
  })

  useEffect(() => {
    const schema = createSchema(allFields)
    setValidationSchema(schema)
  }, [data])

  function submit(values: FormValues) {
    const fieldValues: field_value_insert_input[] = Object.entries(values)
      .filter(
        ([fieldId]) =>
          ["name", "description", "parent", "external_id"].indexOf(fieldId) ===
          -1
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
          initialValues={getInitialFormValues()}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={submit}>
          {formikProps => (
            <div>
              <Group id="general" name="General">
                <Field
                  id="name"
                  name="Name"
                  fieldType="string"
                  fieldTypeMetadata={{ maxLength: 24 }}
                  formikProps={formikProps}
                />
                <Field
                  id="external_id"
                  name="External ID"
                  fieldType="string"
                  fieldTypeMetadata={{ maxLength: 24 }}
                  formikProps={formikProps}
                />
                <Field
                  id="description"
                  name="Description"
                  fieldType="string"
                  fieldTypeMetadata={{ maxLength: 240 }}
                  formikProps={formikProps}
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
                  formikProps={formikProps}
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
                              const id = getIdFromNodeId(field.node.field.id)
                              const name = field.node.field.name
                              const fieldType = field.node.field.field_type.type
                              const fieldTypeMetadata =
                                field.node.field.field_type.metadata

                              if (formikProps.values[id] === undefined) {
                                return null
                              }

                              return (
                                <Field
                                  key={`field-${id}`}
                                  id={id}
                                  fieldType={fieldType}
                                  fieldTypeMetadata={fieldTypeMetadata}
                                  name={name}
                                  formikProps={formikProps}
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
              <Button
                name="form-submit"
                type="submit"
                className="w-1/3"
                disabled={!selectedType}>
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
