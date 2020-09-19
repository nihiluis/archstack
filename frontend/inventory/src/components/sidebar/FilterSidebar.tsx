import React, { useContext } from "react"
import { useFragment, graphql } from "react-relay/hooks"

import {
  FilterSidebar_document_types$key,
  FilterSidebar_document_types,
} from "./__generated__/FilterSidebar_document_types.graphql"
import { DocumentTypesContext } from "../Workspace"
import { WorkspaceQueryResponse } from "../__generated__/WorkspaceQuery.graphql"
import Badge from "../ui/Badge"
import { SidebarTitle, SidebarCategory } from "../ui/Sidebar"

export default function FilterSidebar(): JSX.Element {
  const documentTypeData = useContext(DocumentTypesContext)

  return (
    <React.Fragment>
      <div className="mt-4" />
      <SidebarTitle>Document type</SidebarTitle>
      <SidebarCategory>
        {documentTypeData.document_type_connection.edges.map(type => (
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
              description
            }
          }
        }
      }
    `,
    documentType
  )

  return (
    <Badge
      className="my-2"
      color={documentType.color}
      title={documentType.name}
    />
  )
}
