import React, { useContext } from "react"
import { useFragment, graphql } from "react-relay/hooks"

import { FilterSidebar_document_types$key } from "./__generated__/FilterSidebar_document_types.graphql"
import { DocumentTypesContext } from "../Workspace"
import { WorkspaceQueryResponse } from "../__generated__/WorkspaceQuery.graphql"

export default function FilterSidebar() {
  const documentTypeData = useContext(DocumentTypesContext)

  return documentTypeData.document_type_connection.edges.map(type => (
    <FilterType documentType={type.node} />
  ))
}

function FilterType(props: {
  documentType: WorkspaceQueryResponse["document_type_connection"]["edges"][number]["node"]
}) {
  return <div>{props.documentType.name}</div>
}
