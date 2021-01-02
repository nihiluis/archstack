import React from "react"

import Link from "next/link"
import {
  DocumentHierarchyItem,
  DocumentHierarchyItemMap,
} from "../DocumentSidebar"
import Badge from "../../ui/Badge"
import { getIdFromNodeId } from "../../../lib/hasura"
import { getDocumentName } from "../../../lib/document"

interface Props {
  document: DocumentHierarchyItem["node"]
  documentParent: DocumentHierarchyItem["node"]
  hasDocumentChildren: boolean
  hasDocumentSiblings: boolean
  documentChildrenMap: DocumentHierarchyItemMap
  documentSiblingMap: DocumentHierarchyItemMap
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
      {!documentParent && <p>-</p>}
      {documentParent && (
        <React.Fragment>
          <Badge
            title={documentParent.type.name}
            color={documentParent.type.color}
            className="table mb-2"
          />
          <Link
            href={`/document/[id]`}
            as={`/document/${getIdFromNodeId(documentParent.id)}`}>
            <a className="font-semibold flex">
              {getDocumentName(documentParent)}
            </a>
          </Link>
        </React.Fragment>
      )}
      {!hasDocumentSiblings && (
        <Sibling
          id={getIdFromNodeId(document.id)}
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
            <Badge title={type.name} color={type.color} className="table" />
            <div className="mt-2">
              {edges.map(e => {
                const id = getIdFromNodeId(e.node.id)

                const hasChildren = id === getIdFromNodeId(props.document.id)

                return (
                  <Sibling
                    id={id}
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
  id: string
  hasChildren: boolean
  document: DocumentHierarchyItem["node"]
  childrenMap: DocumentHierarchyItemMap
}

function Sibling({
  id,
  hasChildren,
  document,
  childrenMap,
}: SiblingProps): JSX.Element {
  return (
    <div>
      <Link
        key={`document-child-link-${id}`}
        href={`/document/[id]`}
        as={`/document/${id}`}>
        <a className="font-semibold flex">{getDocumentName(document)}</a>
      </Link>
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
            <Badge title={type.name} color={type.color} className="table" />
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
  )
}
