import { graphql } from "relay-runtime"

export const query = graphql`
  query MutateDocumentQuery($document_id: uuid, $type_id: uuid) {
    document_connection(where: { id: { _eq: $document_id } }) {
      edges {
        node {
          id
          name
          field_values_connection {
            edges {
              node {
                id
                value
                field {
                  id
                }
              }
            }
          }
        }
      }
    }
    parentData: document_connection(
      where: { type: { id: { _eq: $type_id } } }
    ) {
      edges {
        node {
          id
          name
          parent {
            id
            name
          }
        }
      }
    }
    document_type_connection(where: { id: { _eq: $type_id } }) {
      edges {
        node {
          groups_connection {
            edges {
              node {
                id
                name
                sections_connection {
                  edges {
                    node {
                      id
                      name
                      fields_connection {
                        edges {
                          node {
                            field {
                              id
                              name
                              mandatory
                              field_type {
                                id
                                metadata
                                type
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
      }
    }
  }
`

export const mutation = graphql`
  mutation MutateDocumentMutation(
    $id: uuid!
    $name: String!
    $description: String!
    $external_id: String!
    $parent_id: uuid!
    $type_id: uuid!
    $field_values: [field_value_insert_input!]!
  ) {
    insert_document_one(
      object: {
        id: $id
        name: $name
        description: $description
        external_id: $external_id
        parent_id: $parent_id
        type_id: $type_id
        field_values: {
          data: $field_values
          on_conflict: {
            constraint: document_field_values_field_id_document_id_key
            update_columns: value
          }
        }
      }
      on_conflict: {
        constraint: document_pkey
        update_columns: [name, description, external_id, parent_id]
      }
    ) {
      id
    }
  }
`
