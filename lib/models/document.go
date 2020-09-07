package models

import "github.com/gofrs/uuid"

// Document represents an object of the IT landscape.
type Document struct {
	tableName struct{} `pg:"documents"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string
	Name        string `pg:",notnull"`
	Description string `pg:",notnull,default:''"`

	TypeID uuid.UUID `pg:",type:uuid"`
	Type   *DocumentType

	Values []*DocumentFieldValue `pg:"fk:document_id" json:"values"`
}

// DocumentType specifies the type of an object. E.g. an application or an IT component.
type DocumentType struct {
	tableName struct{} `pg:"document_types"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`

	Documents []*Document      `pg:"fk:type_id" json:"documents"`
	Fields    []*DocumentField `pg:"fk:type_id" json:"fields"`

	WorkspaceID uuid.UUID `pg:",type:uuid"`
}

// DocumentField represents a field that contains data for a Document.
type DocumentField struct {
	tableName struct{} `pg:"document_fields"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`

	FieldType string `pg:",notnull"`

	TypeID uuid.UUID `pg:",type:uuid"`
	Type   *DocumentType
}

// DocumentFieldValue specifies the value of a DocumentField.
type DocumentFieldValue struct {
	tableName struct{} `pg:"document_field_values"`

	FieldID    uuid.UUID `pg:",type:uuid,unique:idx_document_id_field_id"`
	Field      *DocumentField
	DocumentID uuid.UUID `pg:",type:uuid,unique:idx_document_id_field_id"`
	Document   *Document
	Value      string
}

// DocumentFieldType represents the data type for a DocumentField and its value.
type DocumentFieldType struct {
	Name string
}

// DocumentMutation is currently unused.
type DocumentMutation struct {
}
