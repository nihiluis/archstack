import React from "react"

import Section from "../ui/section/Section"
import SectionHeader from "../ui/section/SectionHeader"
import SectionTitle from "../ui/section/SectionTitle"
import SectionContent from "../ui/section/SectionContent"
import Subsection from "../ui/section/Subsection"
import { useFragment, graphql } from "react-relay/hooks"
import { DocumentQueryResponse } from "./__generated__/DocumentQuery.graphql"
import { DocumentGroupSection_group$key, DocumentGroupSection_group } from "./__generated__/DocumentGroupSection_group.graphql"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import SubsectionContent from "../ui/section/SubsectionContent"
import SectionInformation, {
  SectionInformationItem,
} from "../ui/section/SectionInformation"
import { DocumentRelationTypeSubsection_type$key } from "./__generated__/DocumentRelationTypeSubsection_type.graphql"

type DocumentRelationType = DocumentGroupSection_group["relation_types_connection"]["edges"][0]["node"]

interface Props {
  item: DocumentRelationType
}

export default function DocumentRelationTypeSubsection(props: Props): JSX.Element {
  const data = useFragment<DocumentRelationTypeSubsection_type$key>(
    graphql`
      fragment DocumentRelationTypeSubsection_type on group_relation_type {
        relation_type {
          id
          name
          from_name
          to_name
        }
      }
    `,
    props.item
  )

  const { id, name } = data.relation_type

  return (
    <Subsection key={`subsection-${id}`} size="full">
      <SubsectionTitle title={name} />
      <SubsectionContent size="full">
      </SubsectionContent>
    </Subsection>
  )
}
