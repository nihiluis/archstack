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
  const documentTypeData = useContext(DocumentTypesContext)
  const data = useLazyLoadQuery<>(
    graphql`
      query FilterSidebarQuery {
        document_type_connection(
          first: 50
          order_by: { timestamp: desc }
          where: {}
        )
          @connection(
            key: "FilterSidebarQuery_document_type_connection"
          ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    {}
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

  const idTypeMap: { [key: string]: WorkspaceDocumentType } = {}
  for (let edge of documentTypeData.document_type_connection.edges) {
    idTypeMap[edge.node.id] = edge
  }

  const rootTypes = documentTypeData.document_type_connection.edges
    .slice()
    .filter(edge => !edge.node.sub_type_of)
  const types = rootTypes.slice()

  useEffect(() => {
    const tmpTypeFilters: TypeFilters = {}

    types.forEach(
      type => (tmpTypeFilters[getIdFromNodeId(type.node.id)] = true)
    )

    setTypeFilters(tmpTypeFilters)
  }, [])

  function insertSubTypes(type: WorkspaceDocumentType) {
    if (type.node.sub_types_connection.edges.length > 0) {
      let idx = types.indexOf(type) + 1

      for (let edge of type.node.sub_types_connection.edges) {
        const subType = idTypeMap[edge.node.id]
        types.splice(idx, 0, subType)

        insertSubTypes(subType)
        idx += subType.node.sub_types_connection.edges.length

        idx++
      }
    }
  }

  for (let type of rootTypes) {
    insertSubTypes(type)
  }

  function toggleTypeFilter(type: string) {
    const newTypeFilters = { ...typeFilters }
    newTypeFilters[type] = !newTypeFilters[type]

    let focusedType = ""

    for (let [type, active] of Object.entries(newTypeFilters)) {
      if (active) {
        if (focusedType) {
          focusedType = ""
          break
        }

        focusedType = type
      }
    }

    setFocusedType(focusedType)
    setTypeFilters(newTypeFilters)
  }

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
          <SidebarCategory></SidebarCategory>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

interface FilterTypeProps {
  documentType: WorkspaceQueryResponse["document_type_connection"]["edges"][number]["node"]
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
