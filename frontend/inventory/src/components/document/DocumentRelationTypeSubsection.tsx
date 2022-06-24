import React from "react"

import Section from "../ui/section/Section"
import SectionHeader from "../ui/section/SectionHeader"
import SectionTitle from "../ui/section/SectionTitle"
import SectionContent from "../ui/section/SectionContent"
import Subsection from "../ui/section/Subsection"
import { useFragment, graphql } from "react-relay/hooks"
import { DocumentQueryResponse } from "./__generated__/DocumentQuery.graphql"
import {
  DocumentGroupSection_group$key,
  DocumentGroupSection_group,
} from "./__generated__/DocumentGroupSection_group.graphql"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import SubsectionContent from "../ui/section/SubsectionContent"
import SectionInformation, {
  SectionInformationItem,
} from "../ui/section/SectionInformation"
import { DocumentRelationTypeSubsection_type$key } from "./__generated__/DocumentRelationTypeSubsection_type.graphql"
import { Document } from "./Document"
import { getIdFromNodeId } from "../../lib/hasura"
import Link from "next/link"
import { getDocumentName } from "../../lib/document"

type DocumentRelationType = DocumentGroupSection_group["relation_types_connection"]["edges"][0]["node"]

interface Props {
  relationType: DocumentRelationType
  document: Document
}

export default function DocumentRelationTypeSubsection(
  props: Props
): JSX.Element {
  const data = useFragment<DocumentRelationTypeSubsection_type$key>(
    graphql`
      fragment DocumentRelationTypeSubsection_type on group_relation_type {
        relation_type {
          id
          name
          bidirectional
          from_name
          to_name
        }
      }
    `,
    props.relationType
  )

  const { id, name, from_name, to_name } = data.relation_type

  const relationTypeId = getIdFromNodeId(data.relation_type.id)

  const toItems = props.document.from_relations_connection.edges
    .filter(e => getIdFromNodeId(e.node.type.id) === relationTypeId)
    .map(e => e.node.to)
  const fromItems = props.document.to_relations_connection.edges
    .filter(e => getIdFromNodeId(e.node.type.id) === relationTypeId)
    .map(e => e.node.from)

  const actualId = getIdFromNodeId(id)

  if (data.relation_type.bidirectional) {
    const items = toItems.concat(fromItems)

    return (
      <DocumentRelationTypeSubsectionInner
        id={actualId}
        name={name}
        type="bidirectional"
        items={items}
      />
    )
  }

  return (
    <React.Fragment>
      <DocumentRelationTypeSubsectionInner
        id={actualId}
        name={from_name}
        type="from"
        items={fromItems}
      />
      <DocumentRelationTypeSubsectionInner
        id={actualId}
        name={to_name}
        type="to"
        items={toItems}
      />
    </React.Fragment>
  )
}

type DocumentRelation = Document["from_relations_connection"]["edges"][0]["node"]["to"]

interface InnerProps {
  id: string
  type: "from" | "to" | "bidirectional"
  name: string
  items: DocumentRelation[]
}

function DocumentRelationTypeSubsectionInner(props: InnerProps): JSX.Element {
  const { id, type, name, items } = props

  return (
    <Subsection key={`subsection-${id}`} size="full">
      <SubsectionTitle title={name} />
      <SubsectionContent size="full">
        {items.map(item => {
          const id = getIdFromNodeId(item.id)

          return (
            <Link
              key={`document-relation-link-${id}`}
              href={`/document/[id]`}
              as={`/document/${id}`}>
              <a className="font-semibold flex">{getDocumentName(item)}</a>
            </Link>
          )
        })}
        {items.length === 0 && <p>-</p>}
      </SubsectionContent>
    </Subsection>
  )
}
