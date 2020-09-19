import React, { useContext } from "react"
import { useFragment, graphql } from "react-relay/hooks"

import {
  FilterSidebar_document_types$key,
  FilterSidebar_document_types,
} from "./__generated__/FilterSidebar_document_types.graphql"
import { DocumentTypesContext } from "../Workspace"
import { WorkspaceQueryResponse } from "../__generated__/WorkspaceQuery.graphql"

export default function FilterSidebar(): JSX.Element {
  const documentTypeData = useContext(DocumentTypesContext)

  return (
    <React.Fragment>
      {documentTypeData.document_type_connection.edges.map(type => (
        <FilterType documentType={type.node} />
      ))}
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

  return <div>{documentType.name}</div>
}
