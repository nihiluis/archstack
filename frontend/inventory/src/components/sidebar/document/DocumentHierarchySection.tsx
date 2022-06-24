import React from "react"

import Link from "next/link"
import {
  DocumentHierarchyItem,
  DocumentHierarchyItemMap,
} from "../DocumentSidebar"
import Badge from "../../ui/Badge"
import { getIdFromNodeId } from "../../../lib/hasura"
import { getDocumentName } from "../../../lib/document"
import MiniBadge from "../../ui/MiniBadge"
import { cx } from "../../../lib/reexports"

interface Props {
  document: DocumentHierarchyItem["node"]
  documentParent: DocumentHierarchyItem["node"]
  hasDocumentChildren: boolean
  hasDocumentSiblings: boolean
  documentChildrenMap: DocumentHierarchyItemMap
  documentSiblingMap: DocumentHierarchyItemMap
}

interface ItemProps {
  document: DocumentHierarchyItem["node"]
  smallText?: boolean
  semiBold?: boolean
  className?: string
}

function Item(props: ItemProps) {
  const { document, smallText, semiBold, className } = props

  return (
    <div className={cx(className, "flex", "p-1", "rounded")}>
      <MiniBadge
        title={document.type.name}
        color={document.type.color}
        className="table mr-2"
      />
      <Link
        href={`/document/[id]`}
        as={`/document/${getIdFromNodeId(document.id)}`}>
        <a
          className={cx(
            { "text-sm": smallText, "font-semibold": semiBold },
            "flex"
          )}>
          {getDocumentName(document, false)}
        </a>
      </Link>
    </div>
  )
}

export default function DocumentHierarchySection(props: Props): JSX.Element {
  const {
    document,
    documentParent,
    hasDocumentChildren,
    hasDocumentSiblings,
    documentChildrenMap,
    documentSiblingMap,
  } = props

  return (
    <>
      {!documentParent && <p className="mb-2">No parent</p>}
      {documentParent && <Item document={documentParent} semiBold />}
      {!hasDocumentSiblings && (
        <Sibling
          primary
          hasChildren={hasDocumentChildren}
          document={document}
          childrenMap={documentChildrenMap}
        />
      )}
      {hasDocumentSiblings && (
        <Siblings
          document={document}
          siblingMap={documentSiblingMap}
          childrenMap={documentChildrenMap}
        />
      )}
    </>
  )
}

interface SiblingsProps {
  document: DocumentHierarchyItem["node"]
  siblingMap: DocumentHierarchyItemMap
  childrenMap: DocumentHierarchyItemMap
}

function Siblings(props: SiblingsProps): JSX.Element {
  const { childrenMap, document, siblingMap } = props

  return (
    <div>
      {Object.entries(siblingMap).map(cont => {
        const [_, edges] = cont

        const type = edges[0].node.type

        return (
          <div className="mr-8" key={`hierarchy-item-type-${type.id}`}>
            <div className="mt-2">
              {edges.map(e => {
                const id = getIdFromNodeId(e.node.id)

                const hasChildren = id === getIdFromNodeId(document.id)

                return (
                  <Sibling
                    primary={hasChildren}
                    hasChildren={hasChildren}
                    document={e.node}
                    childrenMap={childrenMap}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface SiblingProps {
  primary: boolean
  hasChildren: boolean
  document: DocumentHierarchyItem["node"]
  childrenMap: DocumentHierarchyItemMap
}

function Sibling({
  primary,
  hasChildren,
  document,
  childrenMap,
}: SiblingProps): JSX.Element {
  return (
    <div>
      <Item
        document={document}
        smallText
        semiBold
        className={cx("pl-2", { "bg-gray-300": primary })}
      />
      {hasChildren && (
        <Children document={document} childrenMap={childrenMap} />
      )}
    </div>
  )
}

interface ChildrenProps {
  document: DocumentHierarchyItem["node"]
  childrenMap: DocumentHierarchyItemMap
}

function Children(props: ChildrenProps): JSX.Element {
  const { childrenMap } = props

  return (
    <div>
      {Object.entries(childrenMap).map(cont => {
        const [_, edges] = cont

        const type = edges[0].node.type

        return (
          <div className="mr-8" key={`hierarchy-item-type-${type.id}`}>
            <div className="mt-2">
              {edges.map(e => (
                <Item document={e.node} smallText className="ml-4" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
