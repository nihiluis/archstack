import React, { useEffect, useState, Suspense, useContext } from "react"

import { graphql, useLazyLoadQuery } from "react-relay/hooks"
import { getIdFromNodeId } from "../../../lib/hasura"
import { DocumentTypesContext } from "../../Workspace"
import {
  CreateDocumentQuery,
  CreateDocumentQueryResponse,
} from "./__generated__/CreateDocumentQuery.graphql"

interface Props {
  documentId: string
}

const query = graphql`
  query CreateDocumentQuery($id: uuid) {
    document_type_connection(where: { id: { _eq: $id } }) {
      edges {
        node {
          groups_connection {
            edges {
              node {
                sections_connection {
                  edges {
                    node {
                      fields {
                        field {
                          id
                          name
                          field_type
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
  }
`

type Groups = CreateDocumentQueryResponse["document_type_connection"]["edges"][number]["node"]["groups_connection"]["edges"]

export default function CreateDocument(props: Props): JSX.Element {
  const { types } = useContext(DocumentTypesContext)
  const data = useLazyLoadQuery<CreateDocumentQuery>(query, {
    id: props.documentId,
  })

  const [activeTab, setActiveTab] = useState(0)

  const typeData =
    data.document_type_connection.edges.length === 1
      ? data.document_type_connection.edges[0].node
      : null

  const groups: Groups = typeData?.groups_connection.edges ?? []

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
