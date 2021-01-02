import React, { useEffect, useState, Suspense } from "react"

import { graphql, useLazyLoadQuery } from "react-relay/hooks"
import {
  DocumentQuery,
  DocumentQueryResponse,
} from "./__generated__/DocumentQuery.graphql"

import { TabMenu, Tab, TabContainer } from "../ui/TabMenu"
import { getDocumentName } from "../../lib/document"
import DocumentGroupSection from "./DocumentGroupSection"
import AddDocumentView from "./AddDocumentView"
import { getIdFromNodeId } from "../../lib/hasura"

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
          from_relations_connection {
            edges {
              node {
                type {
                  id
                }
                from {
                  id
                }
                to {
                  id
                  name
                  parent {
                    id
                    name
                  }
                }
              }
            }
          }
          to_relations_connection {
            edges {
              node {
                type {
                  id
                }
                from {
                  id
                  name
                  parent {
                    id
                    name
                  }
                }
                to {
                  id
                  type {
                    id
                  }
                }
              }
            }
          }
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
                  ...DocumentGroupSection_group
                }
              }
            }
          }
        }
      }
    }
  }
`
export type Document = DocumentQueryResponse["document_connection"]["edges"][0]["node"]
type Group = Document["type"]["groups_connection"]["edges"][0]

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

  const groups: Group[] =
    (documentData?.type.groups_connection.edges as Group[]) ?? []

  return (
    <React.Fragment>
      {!hasDocument && (
        <p className="text-error">Unable to find this document.</p>
      )}
      {hasDocument && (
        <div>
          <Suspense fallback={null}>
            <AddDocumentView documentId={getIdFromNodeId(documentData.id)} />
          </Suspense>
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
              {groups.map(e => (
                <DocumentGroupSection
                  key={`document-group-section-wrapper-${(e.node as any).id}`}
                  document={documentData}
                  group={e.node}
                />
              ))}
            </Tab>
          </TabContainer>
        </div>
      )}
    </React.Fragment>
  )
}
