import React, { useContext } from "react"
import { useFragment, graphql } from "react-relay/hooks"

import {
  FilterSidebar_document_types$key,
  FilterSidebar_document_types,
} from "./__generated__/FilterSidebar_document_types.graphql"
import { DocumentTypesContext, WorkspaceDocumentType } from "../Workspace"
import { WorkspaceQueryResponse } from "../__generated__/WorkspaceQuery.graphql"
import Badge from "../ui/Badge"
import { SidebarTitle, SidebarCategory } from "../ui/Sidebar"

export default function FilterSidebar(): JSX.Element {
  const documentTypeData = useContext(DocumentTypesContext)

  const idTypeMap: { [key: string]: WorkspaceDocumentType } = {}
  for (let edge of documentTypeData.document_type_connection.edges) {
    idTypeMap[edge.node.id] = edge
  }

  const rootTypes = documentTypeData.document_type_connection.edges
    .slice()
    .filter(edge => !edge.node.sub_type_of)
  const types = rootTypes.slice()

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

  return (
    <React.Fragment>
      <div className="mt-4" />
      <p className="ml-4 mb-3">Filter by</p>
      <SidebarTitle>Document type</SidebarTitle>
      <SidebarCategory>
        {types.map(type => (
          <FilterType
            key={`filterType-${type.node.id}`}
            documentType={type.node}
          />
        ))}
      </SidebarCategory>
    </React.Fragment>
  )
}

function FilterType({
  documentType,
}: {
  documentType: WorkspaceQueryResponse["document_type_connection"]["edges"][number]["node"]
}) {
  const data = useFragment<FilterSidebar_document_types$key>(
    graphql`
      fragment FilterSidebar_document_types on document_type {
        fields_connection(first: 1000)
          @connection(key: "document_type_fields_connection") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
    documentType
  )

  return (
    <Badge
      className="my-2 w-3/4"
      color={documentType.color}
      title={documentType.name}
    />
  )
}
