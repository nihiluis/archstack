import React from "react"
import { useFragment, graphql } from "react-relay/hooks"

interface Props {
  documentType: any
}

export default function TypeSidebar(props: Props) {
  const data = useFragment(
    graphql`
      fragment TypeSidebar_document_types on document_type {
        fields_connection @connection(key: "document_type_fields_connection") {
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
    props.documentType
  )
}
