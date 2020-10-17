import React from "react"

import Section from "../ui/section/Section"
import SectionContent from "../ui/section/SectionContent"
import SectionHeader from "../ui/section/SectionHeader"
import SectionTitle from "../ui/section/SectionTitle"
import Subsection from "../ui/section/Subsection"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import SubsectionContent from "../ui/section/SubsectionContent"
import { DocumentHierarchyItem, DocumentHierarchyItemMap } from "./Document"
import Badge from "../ui/Badge"
import Link from "next/link"
import { getIdFromNodeId } from "../../lib/hasura"
import { getDocumentName } from "../../lib/document"
import DocumentHierarchyItemSubsection from "./DocumentHierarchyItemSubsection"

interface Props {
  documentParent: DocumentHierarchyItem["node"]
  hasDocumentChildren: boolean
  hasDocumentSiblings: boolean
  documentChildrenMap: DocumentHierarchyItemMap
  documentSiblingMap: DocumentHierarchyItemMap
}

export default function DocumentHierarchySection(props: Props): JSX.Element {
  const {
    documentParent,
    hasDocumentChildren,
    hasDocumentSiblings,
    documentChildrenMap,
    documentSiblingMap,
  } = props

  return (
    <Section>
      <SectionHeader>
        <SectionTitle title="Hierarchy" size="full" />
      </SectionHeader>
      <SectionContent size="full">
        <Subsection size="full">
          <SubsectionTitle title="Parent" />
          <SubsectionContent size="full">
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
          </SubsectionContent>
        </Subsection>
        <DocumentHierarchyItemSubsection
          title="Children"
          hasItems={hasDocumentChildren}
          itemMap={documentChildrenMap}
        />
        <DocumentHierarchyItemSubsection
          title="Siblings"
          hasItems={hasDocumentSiblings}
          itemMap={documentSiblingMap}
        />
      </SectionContent>
    </Section>
  )
}
