import React, { useEffect, useState } from "react"

import { graphql, useLazyLoadQuery } from "react-relay/hooks"
import {
  DocumentQuery,
  DocumentQueryResponse,
} from "./__generated__/DocumentQuery.graphql"
import Section from "../ui/section/Section"
import SectionContent from "../ui/section/SectionContent"
import SectionHeader from "../ui/section/SectionHeader"
import SectionTitle from "../ui/section/SectionTitle"
import Subsection from "../ui/section/Subsection"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import SubsectionContent from "../ui/section/SubsectionContent"
import { TabMenu, Tab, TabContainer } from "../ui/TabMenu"
import SectionInformation from "../ui/section/SectionInformation"

interface Props {
  documentId: string
}

const query = graphql`
  query DocumentQuery($id: uuid) {
    document_connection(where: { id: { _eq: $id } }) {
      edges {
        node {
          id
          created_at
          description
          external_id
          name
          type {
            color
            description
            created_at
            external_id
            id
            name
            updated_at
            groups_connection {
              edges {
                node {
                  id
                  name
                  sections_connection {
                    edges {
                      node {
                        fields_connection {
                          edges {
                            node {
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
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export default function Document(props: Props): JSX.Element {
  const data = useLazyLoadQuery<DocumentQuery>(query, {
    id: props.documentId,
  })

  type Group = DocumentQueryResponse["document_connection"]["edges"][0]["node"]["type"]["groups_connection"]["edges"][0]

  const tabItems = ["Data", "Subscriptions", "Comments", "History"]
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {}, [data])

  const hasDocument = data.document_connection.edges.length === 1
  const documentData = hasDocument
    ? data.document_connection.edges[0].node
    : null

  const groups: Group[] =
    (documentData?.type.groups_connection.edges as Group[]) ?? []

  return (
    <React.Fragment>
      {!hasDocument && (
        <p className="text-error">Unable to find this document.</p>
      )}
      {hasDocument && (
        <div>
          <div className="mb-2 flex items-center">
            <h1 className="font-semibold mb-1 text-3xl">{documentData.name}</h1>
            <div
              className="rounded-full py-1 px-2 text-white table ml-4"
              style={{ backgroundColor: documentData.type.color }}>
              {documentData.type.name}
            </div>
          </div>
          <TabMenu
            items={tabItems}
            activeIndex={activeTab}
            onClick={setActiveTab}
          />
          <TabContainer>
            <Tab showWhenTab={0} currentTab={activeTab}>
              {groups.map(e => (
                <Section key={`section-${e.node.id}`}>
                  <SectionHeader>
                    <SectionTitle title={e.node.name} size="full" />
                  </SectionHeader>
                  <SectionContent size="full">
                    {e.node.sections_connection.edges.map(e2 => (
                      <Subsection key={`subsection-${e2.node.id}`} size="full">
                        <SubsectionTitle title={e2.node.name} />
                        <SubsectionContent size="full">
                          <SectionInformation
                            items={e2.node.fields_connection.edges.map(e3 => {
                              const value =
                                e3.node.field_values_connection.edges.length > 0
                                  ? e3.node.field_values_connection.edges[0]
                                      .node
                                  : null

                              return {
                                name: e3.node.name,
                                value: value?.value ?? "",
                              }
                            })}
                          />
                        </SubsectionContent>
                      </Subsection>
                    ))}
                  </SectionContent>
                </Section>
              ))}
            </Tab>
          </TabContainer>
        </div>
      )}
    </React.Fragment>
  )
}
