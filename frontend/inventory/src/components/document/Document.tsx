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
import { getDocumentName } from "../../lib/document"
import Link from "next/link"
import { getIdFromNodeId } from "../../lib/hasura"
import MiniBadge from "../ui/MiniBadge"
import Badge from "../ui/Badge"

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
              }
            }
          }
        }
      }
    }
  }
`

type Group = DocumentQueryResponse["document_connection"]["edges"][0]["node"]["type"]["groups_connection"]["edges"][0]
type DocumentHierarchyItem = {
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
type DocumentHierarchyItemMap = { [key: string]: DocumentHierarchyItem[] }

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

const tabItems = ["Data", "Subscriptions", "Comments", "History"]

export default function Document(props: Props): JSX.Element {
  const data = useLazyLoadQuery<DocumentQuery>(query, {
    id: props.documentId,
  })

  const [activeTab, setActiveTab] = useState(0)

  const hasDocument = data.document_connection.edges.length === 1
  const documentData = hasDocument
    ? data.document_connection.edges[0].node
    : null

  const documentParent = documentData.parent

  const documentChildren = documentData.children_connection?.edges ?? []
  const hasDocumentChildren = documentChildren.length > 0

  const documentSiblings = documentParent
    ? documentParent.children_connection?.edges.filter(
        e => e.node.id !== documentData.id
      ) ?? []
    : []
  const hasDocumentSiblings = documentSiblings.length > 0

  const documentChildrenMap = organizeHierarchyItems(documentChildren)
  const documentSiblingMap = organizeHierarchyItems(documentSiblings)

  const groups: Group[] =
    (documentData?.type.groups_connection.edges as Group[]) ?? []

  return (
    <React.Fragment>
      {!hasDocument && (
        <p className="text-error">Unable to find this document.</p>
      )}
      {hasDocument && (
        <div>
          <div>
            <div className="mb-2 flex items-center">
              <h1 className="font-semibold text-3xl flex">
                {getDocumentName(documentData)}
              </h1>
              <div
                className="rounded-full py-1 px-2 text-white table ml-4"
                style={{ backgroundColor: documentData.type.color }}>
                {documentData.type.name}
              </div>
            </div>
            <div className="rounded-md py-1 px-3 mb-4 text-xl text-gray-600 bg-white max-w-md">
              {documentData.description || "-"}
            </div>
          </div>
          <TabMenu
            items={tabItems}
            activeIndex={activeTab}
            onClick={setActiveTab}
          />
          <TabContainer>
            <Tab showWhenTab={0} currentTab={activeTab}>
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
                          <Badge title={documentParent.type.name} color={documentParent.type.color} className="table mb-2" />
                          <Link
                            href={`/document/[id]`}
                            as={`/document/${getIdFromNodeId(
                              documentParent.id
                            )}`}>
                            <a className="font-semibold flex">
                              {getDocumentName(documentParent)}
                            </a>
                          </Link>
                        </React.Fragment>
                      )}
                    </SubsectionContent>
                  </Subsection>
                  <Subsection size="full">
                    <SubsectionTitle title="Children" />
                    <SubsectionContent size="full">
                      {!hasDocumentChildren && <p>-</p>}
                      {hasDocumentChildren && (
                        <div className="flex">
                          {Object.entries(documentChildrenMap).map(cont => {
                            const [_, edges] = cont

                            const type = edges[0].node.type

                            return (
                              <div className="mr-8">
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
                      )}
                    </SubsectionContent>
                  </Subsection>
                  <Subsection size="full">
                    <SubsectionTitle title="Siblings" />
                    <SubsectionContent size="full">
                      {!hasDocumentSiblings && <p>-</p>}
                      {hasDocumentSiblings && (
                        <div className="flex">
                          {Object.entries(documentSiblingMap).map(cont => {
                            const [_, edges] = cont

                            const type = edges[0].node.type

                            return (
                              <div>
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
                      )}
                    </SubsectionContent>
                  </Subsection>
                </SectionContent>
              </Section>
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
                                e3.node.field.field_values_connection.edges
                                  .length > 0
                                  ? e3.node.field.field_values_connection
                                      .edges[0].node
                                  : null

                              return {
                                name: e3.node.field.name,
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
