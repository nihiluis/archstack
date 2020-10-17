import React from "react"

import Section from "../ui/section/Section"
import SectionHeader from "../ui/section/SectionHeader"
import SectionTitle from "../ui/section/SectionTitle"
import SectionContent from "../ui/section/SectionContent"
import Subsection from "../ui/section/Subsection"
import { useFragment, graphql } from "react-relay/hooks"
import { DocumentQueryResponse } from "./__generated__/DocumentQuery.graphql"
import { DocumentGroupSection_group$key } from "./__generated__/DocumentGroupSection_group.graphql"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import SubsectionContent from "../ui/section/SubsectionContent"
import SectionInformation from "../ui/section/SectionInformation"
import DocumentRelationTypeSubsection from "./DocumentRelationTypeSubsection"

type Group = DocumentQueryResponse["document_connection"]["edges"][0]["node"]["type"]["groups_connection"]["edges"][0]["node"]

interface Props {
  item: Group
}

export default function DocumentGroupSection(props: Props): JSX.Element {
  const data = useFragment<DocumentGroupSection_group$key>(
    graphql`
      fragment DocumentGroupSection_group on group {
        id
        name
        relation_types_connection {
          edges {
            node {
              ...DocumentRelationTypeSubsection_type
            }
          }
        }
        sections_connection {
          edges {
            node {
              fields_connection {
                edges {
                  node {
                    field {
                      id
                      description
                      created_at
                      id
                      mandatory
                      name
                      order
                      updated_at
                      field_type
                      external_id
                      field_values_connection(
                        where: { document: { id: { _eq: $id } } }
                        first: 1
                      ) {
                        edges {
                          node {
                            id
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
              id
              name
            }
          }
        }
      }
    `,
    props.item
  )

  return (
    <Section key={`section-${data.id}`}>
      <SectionHeader>
        <SectionTitle title={data.name} size="full" />
      </SectionHeader>
      <SectionContent size="full">
        {data.sections_connection.edges.map(e2 => (
          <Subsection key={`subsection-${e2.node.id}`} size="full">
            <SubsectionTitle title={e2.node.name} />
            <SubsectionContent size="full">
              <SectionInformation
                items={e2.node.fields_connection.edges.map(e3 => {
                  const name = e3.node.field.name
                  const value =
                    e3.node.field.field_values_connection.edges.length > 0
                      ? e3.node.field.field_values_connection.edges[0].node
                      : null

                  return { name, value: value?.value }
                })}
              />
            </SubsectionContent>
          </Subsection>
        ))}
        {(data.relation_types_connection?.edges ?? []).map(e => (
          <DocumentRelationTypeSubsection item={e.node} />
        ))}
      </SectionContent>
    </Section>
  )
}
