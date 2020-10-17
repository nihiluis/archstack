import React from "react"

import Subsection from "../ui/section/Subsection"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import SubsectionContent from "../ui/section/SubsectionContent"
import Badge from "../ui/Badge"
import { DocumentHierarchyItemMap } from "./Document"
import { getIdFromNodeId } from "../../lib/hasura"
import Link from "next/link"
import { getDocumentName } from "../../lib/document"

interface Props {
  title: string
  hasItems: boolean
  itemMap: DocumentHierarchyItemMap
}

export default function DocumentHierarchyItemSubsection(
  props: Props
): JSX.Element {
  const { hasItems, itemMap, title } = props

  return (
    <Subsection size="full">
      <SubsectionTitle title={title} />
      <SubsectionContent size="full">
        {!hasItems && <p>-</p>}
        {hasItems && (
          <div className="flex">
            {Object.entries(itemMap).map(cont => {
              const [_, edges] = cont

              const type = edges[0].node.type

              return (
                <div className="mr-8" key={`hierarchy-item-type-${type.id}`}>
                  <Badge
                    title={type.name}
                    color={type.color}
                    className="table"
                  />
                  <div className="mt-2">
                    {edges.map(e => {
                      const id = getIdFromNodeId(e.node.id)

                      return (
                        <Link
                          key={`document-child-link-${id}`}
                          href={`/document/[id]`}
                          as={`/document/${id}`}>
                          <a className="font-semibold flex">
                            {getDocumentName(e.node)}
                          </a>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SubsectionContent>
    </Subsection>
  )
}
