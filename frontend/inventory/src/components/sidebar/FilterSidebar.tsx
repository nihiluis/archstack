import React, { useContext, useEffect } from "react"
import { useFragment, graphql, useLazyLoadQuery } from "react-relay/hooks"

import {
  FilterSidebar_document_types$key,
  FilterSidebar_document_types,
} from "./__generated__/FilterSidebar_document_types.graphql"
import { DocumentTypesContext, WorkspaceDocumentType } from "../Workspace"
import { WorkspaceQueryResponse } from "../__generated__/WorkspaceQuery.graphql"
import Badge from "../ui/Badge"
import { SidebarTitle, SidebarCategory } from "../ui/Sidebar"
import { cx } from "../../lib/reexports"
import { FieldFilters, TypeFilters } from "../../../pages"
import { getIdFromNodeId } from "../../lib/hasura"
import Input from "../ui/input"
import FormRow from "../ui/FormRow"
import { FilterSidebarQuery } from "./__generated__/FilterSidebarQuery.graphql"

interface Props {
  typeFilters: TypeFilters
  setTypeFilters: (typeFilters: TypeFilters) => void
  nameFilter: string
  setNameFilter: (name: string) => void
  parentNameFilter: string
  setParentNameFilter: (parentName: string) => void
  descriptionFilter: string
  setDescriptionFilter: (description: string) => void
  fieldFilters: FieldFilters
  setFieldFilters: (fieldFilters: FieldFilters) => void
  focusedType: string
  setFocusedType: (type: string) => void
}

export default function FilterSidebar(props: Props): JSX.Element {
  const { types } = useContext(DocumentTypesContext)
  const fieldData = useLazyLoadQuery<FilterSidebarQuery>(
    graphql`
      query FilterSidebarQuery($id: uuid) {
        document_type_connection(where: { id: { _eq: $id } }) {
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
    `,
    { id: props.focusedType || null }
  )

  const {
    typeFilters,
    setTypeFilters,
    nameFilter,
    setNameFilter,
    parentNameFilter,
    setParentNameFilter,
    descriptionFilter,
    setDescriptionFilter,
    fieldFilters,
    setFieldFilters,
    focusedType,
    setFocusedType,
  } = props

  useEffect(() => {
    const tmpTypeFilters: TypeFilters = {}

    types.forEach(
      type => (tmpTypeFilters[getIdFromNodeId(type.node.id)] = true)
    )

    setTypeFilters(tmpTypeFilters)
  }, [])

  const fields = fieldData.document_type_connection.edges.flatMap(edge =>
    edge.node.fields.map(field => field.field)
  )

  function toggleTypeFilter(type: string) {
    const newTypeFilters = { ...typeFilters }
    newTypeFilters[type] = !newTypeFilters[type]

    setTypeFilters(newTypeFilters)
  }

  function updateFocusedType() {
    let focusedType = ""

    for (let [type, active] of Object.entries(typeFilters)) {
      if (active) {
        if (focusedType) {
          focusedType = ""
          break
        }

        focusedType = type
      }
    }

    setFocusedType(focusedType)
  }

  useEffect(updateFocusedType, [typeFilters])

  return (
    <React.Fragment>
      <div className="mt-4" />
      <SidebarTitle>General</SidebarTitle>
      <SidebarCategory>
        <FormRow label="Name">
          <Input
            name="name"
            value={nameFilter}
            handleChange={name => {
              setNameFilter(name)
            }}
            type="text"
            className="w-3/4"
          />
        </FormRow>
        <FormRow label="Parent name">
          <Input
            name="parentName"
            value={parentNameFilter}
            handleChange={name => {
              setParentNameFilter(name)
            }}
            type="text"
            className="w-3/4"
          />
        </FormRow>
        <FormRow label="Description">
          <Input
            name="description"
            value={descriptionFilter}
            handleChange={name => {
              setDescriptionFilter(name)
            }}
            type="text"
            className="w-3/4"
          />
        </FormRow>
      </SidebarCategory>
      <SidebarTitle>Document type</SidebarTitle>
      <SidebarCategory>
        {types.map(type => {
          const id = getIdFromNodeId(type.node.id)

          return (
            <FilterType
              key={`filterType-${type.node.id}`}
              documentType={type.node}
              toggleTypeFilter={toggleTypeFilter}
              active={typeFilters[id]}
            />
          )
        })}
      </SidebarCategory>
      {focusedType && (
        <React.Fragment>
          <SidebarTitle>Fields</SidebarTitle>
          <SidebarCategory>
            {fields.map(field => (
              <div key={`sidebar-field-${field.id}`}>
                <p className="mb-1">{field.name}</p>
                <Input name={field.id} value="" type="text" className="w-3/4" />
              </div>
            ))}
          </SidebarCategory>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

type DocumentType = WorkspaceQueryResponse["document_type_connection"]["edges"][number]["node"]

interface FilterTypeProps {
  documentType: DocumentType
  active: boolean
  toggleTypeFilter: (type: string) => void
}

function FilterType({
  documentType,
  active,
  toggleTypeFilter,
}: FilterTypeProps) {
  const data = useFragment<FilterSidebar_document_types$key>(
    graphql`
      fragment FilterSidebar_document_types on document_type {
        fields_connection(first: 1000)
          @connection(key: "FilterSidebar_document_type_fields_connection") {
          edges {
            node {
              field {
                id
                name
              }
            }
          }
        }
      }
    `,
    documentType
  )

  const isSubType = !!documentType.sub_type_of
  const classes = cx("my-2 table", {
    //"border-l-4": isSubType,
    "ml-4": isSubType,
  })
  const style = isSubType
    ? {
        /*borderColor: documentType.sub_type_of.color*/
      }
    : {}

  function onClick() {
    toggleTypeFilter(getIdFromNodeId(documentType.id))
  }

  return (
    <Badge
      className={classes}
      color={documentType.color}
      outline={!active}
      style={style}
      onClick={onClick}
      title={documentType.name.substring(0, 15)}
    />
  )
}
