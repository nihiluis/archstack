import React, { Suspense } from "react"

import * as RefreshSVG from "../icons/Refresh.svg"
import * as ChevronDownSVG from "../icons/ChevronDown.svg"
import Line from "../ui/Line"
import {
  usePaginationFragment,
  graphql,
  useLazyLoadQuery,
  useFragment,
} from "react-relay/hooks"
import { DocumentListPaginationQuery } from "./__generated__/DocumentListPaginationQuery.graphql"
import {
  DocumentListComponent_document$key,
  DocumentListComponent_document$data,
  DocumentListComponent_document,
} from "./__generated__/DocumentListComponent_document.graphql"
import {
  DocumentListQueryResponse,
  DocumentListQuery,
} from "./__generated__/DocumentListQuery.graphql"
import MiniBadge from "../ui/MiniBadge"
import Button from "../ui/Button"
import {
  DocumentListItem_field_values$key,
  DocumentListItem_field_values,
} from "./__generated__/DocumentListItem_field_values.graphql"
import Badge from "../ui/Badge"
import Link from "next/link"
import { getIdFromNodeId } from "../../lib/hasura"
import { getDocumentName } from "../../lib/document"

interface Props {}

export default function DocumentList(props: Props): JSX.Element {
  const data = useLazyLoadQuery<DocumentListQuery>(
    graphql`
      query DocumentListQuery {
        ...DocumentListComponent_document
      }
    `,
    {}
  )

  return (
    <div>
      <Menu />
      <Suspense fallback="Loading...">
        <DocumentListComponent data={data} />
      </Suspense>
    </div>
  )
}

function Menu(): JSX.Element {
  return (
    <div>
      <div className="flex justify-between w-full mb-3">
        <div>
          <button className="btn btn-secondary mr-2">New</button>
          <button className="btn btn-secondary">Export</button>
        </div>
        <div className="flex items-center">
          <div className="flex">
            <p className="font-semibold mr-1">Sort by</p>
            <ChevronDownSVG style={{ width: 24, height: 24 }} />
          </div>
          <RefreshSVG style={{ width: 16, height: 16 }} />
        </div>
      </div>
    </div>
  )
}

function DocumentListComponent(props: {
  data: DocumentListQueryResponse
}): JSX.Element {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    DocumentListPaginationQuery,
    DocumentListComponent_document$key
  >(
    graphql`
      fragment DocumentListComponent_document on query_root
      @argumentDefinitions(
        cursor: { type: "String" }
        first: { type: "Int", defaultValue: 10 }
      )
      @refetchable(queryName: "DocumentListPaginationQuery") {
        document_connection(
          first: $first
          after: $cursor
          order_by: { created_at: desc }
        ) @connection(key: "DocumentList_document_connection") {
          edges {
            node {
              nodeId: id
              external_id
              name
              description
              created_at
              updated_at
              parent {
                id
                name
              }
              type {
                id
                name
                color
                sub_type_of {
                  id
                }
                sub_types {
                  id
                  name
                  color
                }
              }
              ...DocumentListItem_field_values
            }
            cursor
          }
        }
      }
    `,
    props.data
  )

  return (
    <div className="mt-2">
      <Suspense fallback={"Loading documents..."}>
        <div>
          {(data.document_connection?.edges || []).length === 0 && (
            <p>No objects found.</p>
          )}
          {(data.document_connection?.edges || []).map(edge => {
            return (
              <DocumentListItem
                key={`DocumentListItem-${edge.node.nodeId}`}
                item={edge.node}
              />
            )
          })}
        </div>
      </Suspense>
      {hasNext ? (
        <div style={{ textAlign: "center" }}>
          <Button
            type="button"
            onClick={() => {
              loadNext(10)
            }}
            className="btn-secondary"
            disabled={isLoadingNext}>
            {isLoadingNext ? "Loading..." : "Load More"}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

interface ItemProps {
  item: DocumentListComponent_document["document_connection"]["edges"][0]["node"]
}

function DocumentListItem(props: ItemProps) {
  const { name, description, type, nodeId } = props.item
  const id = getIdFromNodeId(nodeId)

  const data = useFragment<DocumentListItem_field_values$key>(
    graphql`
      fragment DocumentListItem_field_values on document {
        type {
          fields_connection(
            first: 6
            where: { field: { preview_info: { show: { _eq: true } } } }
            order_by: { field: { order: asc } }
          ) @connection(key: "document_fields_connection") {
            edges {
              node {
                field {
                  nodeId: id
                  name
                  preview_info {
                    type
                  }
                }
              }
            }
          }
        }
        field_values_connection(
          first: 6
          where: { field: { preview_info: { show: { _eq: true } } } }
          order_by: { field: { order: asc } }
        ) @connection(key: "document_field_values_connection") {
          edges {
            node {
              value
              field {
                nodeId: id
              }
            }
          }
        }
      }
    `,
    props.item
  )

  return (
    <div key={`DocumentListItem-div-${id}`} className="">
      <Line />
      <div className="flex justify-between w-full">
        <div className="py-2 px-2 w-1/5">
          <div className="flex">
            <MiniBadge
              title={type.name}
              className="mt-2 mr-2"
              color={type.color}
            />
            <div>
              <Link href={`/document/[id]`} as={`/document/${id}`}>
                <a className="font-semibold flex">{getDocumentName(props.item)}</a>
              </Link>
              <p className="font-unfocused">{description || "-"}</p>
            </div>
          </div>
        </div>
        <div className="flex py-2 px-2 w-4/5">
          <Badge
            title="Fields"
            className="w-14 h-8 flex items-center mr-4 bg-gray-300"
          />
          <Suspense fallback="Loading...">
            {(data.type.fields_connection?.edges || [])
              .filter(edge => edge.node.field.preview_info.type === "label")
              .map(edge => {
                const value = data.field_values_connection?.edges.find(
                  edge2 => edge2.node.field.nodeId === edge.node.field.nodeId
                )

                return (
                  <DocumentListItemFieldText
                    key={`DocumentListItemField-${edge.node.field.nodeId}`}
                    field={edge.node}
                    value={value?.node}
                  />
                )
              })}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  field: DocumentListItem_field_values["type"]["fields_connection"]["edges"][0]["node"]
  value?: DocumentListItem_field_values["field_values_connection"]["edges"][0]["node"]
}

function DocumentListItemFieldText(props: FieldProps): JSX.Element {
  return (
    <div className="mr-8">
      <p className="font-semibold text-gray-600">{props.field.field.name}</p>
      <p className="font-unfocused">{props.value?.value || "-"}</p>
    </div>
  )
}
