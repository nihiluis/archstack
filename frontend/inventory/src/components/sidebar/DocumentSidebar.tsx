import React, { Suspense, useEffect } from "react"
import { useLazyLoadQuery, graphql } from "react-relay/hooks"
import { SidebarCategory, SidebarTitle } from "../ui/Sidebar"
import MiniBadge from "../ui/MiniBadge"
import Link from "next/link"

import * as rightSidebarStyle from "./RightSidebar.module.css"
import { getDocumentName } from "../../lib/document"
import { cx } from "../../lib/reexports"
import {
  DocumentSidebarQuery,
  DocumentSidebarQueryResponse,
} from "./__generated__/DocumentSidebarQuery.graphql"
import DocumentHierarchySection from "./document/DocumentHierarchySection"

const query = graphql`
  query DocumentSidebarQuery($id: uuid) {
    document_connection(where: { id: { _eq: $id } }) {
      edges {
        node {
          id
          created_at
          description
          external_id
          parent {
            id
            name
            type {
              id
              name
              color
            }
            children_connection {
              edges {
                node {
                  id
                  name
                  parent {
                    id
                    name
                  }
                  type {
                    id
                    name
                    color
                  }
                }
              }
            }
          }
          children_connection {
            edges {
              node {
                id
                name
                parent {
                  id
                  name
                }
                type {
                  id
                  name
                  color
                }
              }
            }
          }
          name
          type {
            color
            description
            created_at
            external_id
            id
            name
            updated_at
          }
        }
      }
    }
  }
`
interface Props {
  documentId: string
}

export default function DocumentSidebarWrapper(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <DocumentSidebar {...props} />
    </Suspense>
  )
}

type QueryNode = DocumentSidebarQueryResponse["document_connection"]["edges"][0]["node"]

export type DocumentHierarchyItem = {
  readonly node: {
    readonly id: string
    readonly name: string
    readonly type: {
      readonly id: string
      readonly name: string
      readonly color: string
    }
  }
}
type DocumentHierarchyItems = readonly DocumentHierarchyItem[]
export type DocumentHierarchyItemMap = {
  [key: string]: DocumentHierarchyItem[]
}

function organizeHierarchyItems(
  items: DocumentHierarchyItems
): DocumentHierarchyItemMap {
  const map: DocumentHierarchyItemMap = {}

  for (let item of items) {
    if (!map.hasOwnProperty(item.node.type.id)) {
      map[item.node.type.id] = []
    }

    map[item.node.type.id].push(item)
  }

  return map
}

function DocumentSidebar(props: Props): JSX.Element {
  const data = useLazyLoadQuery<DocumentSidebarQuery>(query, {
    id: props.documentId,
  })

  const hasDocument = data.document_connection.edges.length === 1
  const documentData = hasDocument
    ? data.document_connection.edges[0].node
    : null

  const documentParent = documentData.parent

  const documentChildren = documentData.children_connection?.edges ?? []
  const hasDocumentChildren = documentChildren.length > 0

  const documentSiblings = documentParent
    ? documentParent.children_connection?.edges ?? []
    : []
  const hasDocumentSiblings = documentSiblings.length > 0

  const documentChildrenMap = organizeHierarchyItems(documentChildren)
  const documentSiblingMap = organizeHierarchyItems(documentSiblings)

  return (
    <React.Fragment>
      <div className="mb-4" />
      <SidebarTitle>Hierarchy</SidebarTitle>
      <SidebarCategory>
        <DocumentHierarchySection
          document={documentData}
          documentParent={documentParent}
          hasDocumentSiblings={hasDocumentSiblings}
          hasDocumentChildren={hasDocumentChildren}
          documentSiblingMap={documentSiblingMap}
          documentChildrenMap={documentChildrenMap}
        />
      </SidebarCategory>
    </React.Fragment>
  )
}
