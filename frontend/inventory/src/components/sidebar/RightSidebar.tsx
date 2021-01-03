import React, { Suspense, useEffect } from "react"
import { useLazyLoadQuery, graphql } from "react-relay/hooks"
import {
  RightSidebarQuery,
  RightSidebarQueryResponse,
} from "./__generated__/RightSidebarQuery.graphql"
import { SidebarCategory, SidebarTitle } from "../ui/Sidebar"
import MiniBadge from "../ui/MiniBadge"
import Link from "next/link"

import * as rightSidebarStyle from "./RightSidebar.module.css"
import { getDocumentName } from "../../lib/document"
import { cx } from "../../lib/reexports"

export default function RightSidebarWrapper(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <RightSidebar />
    </Suspense>
  )
}

type QueryNode = RightSidebarQueryResponse["recently_viewed_document_connection"]["edges"][0]["node"]

function RightSidebar(): JSX.Element {
  const data = useLazyLoadQuery<RightSidebarQuery>(
    graphql`
      query RightSidebarQuery {
        recently_viewed_document_connection(
          first: 50
          order_by: { timestamp: desc }
        )
          @connection(
            key: "RightSidebarQuery_recently_viewed_document_connection"
          ) {
          edges {
            node {
              id
              timestamp
              document {
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
      }
    `,
    {}
  )

  let counter = 0
  const items: QueryNode[] = []
  const documentIds: { [key: string]: null } = {}

  for (let edge of data.recently_viewed_document_connection.edges) {
    if (counter >= 8) break

    if (!documentIds.hasOwnProperty(edge.node.document.id)) {
      documentIds[edge.node.document.id] = null

      items.push(edge.node)

      counter = counter + 1
    }
  }

  return (
    <React.Fragment>
      <div className="mb-4" />
      <SidebarTitle>Actions</SidebarTitle>
      <SidebarCategory>
        <p>Create Document</p>
        <p>Export data</p>
      </SidebarCategory>
      <SidebarTitle>Recently viewed</SidebarTitle>
      <SidebarCategory>
        <ul>
          {items.length === 0 && <p>-</p>}
          {items.map(item => (
            <div
              key={`recently-viewed-item-${item.id}-div`}
              className={cx(rightSidebarStyle.recentlyViewedItem)}>
              <MiniBadge
                title={item.document.type.name}
                color={item.document.type.color}
              />
              <Link
                key={`recently-viewed-item-${item.document.name}`}
                href={`/document/[id]`}
                as={`/document/${item.document.id}`}>
                <a className="font-semibold flex">
                  {getDocumentName(item.document)}
                </a>
              </Link>
            </div>
          ))}
        </ul>
      </SidebarCategory>
    </React.Fragment>
  )
}
