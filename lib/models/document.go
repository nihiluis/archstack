package models

import "github.com/gofrs/uuid"

type Document struct {
	tableName struct{} `pg:"documents"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string
	Name        string `pg:",notnull"`
	Description string `pg:",notnull,default:''"`

	TypeID    uuid.UUID `pg:",type:uuid,unique:idx_auth_id"`
	Relations []*DocumentRelation
}

type DocumentType struct {
	tableName struct{} `pg:"document_types"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`

	Fields []*DocumentField `json:"fields" pg:"many2many:workspaces_users"`
}

type DocumentField struct {
	tableName struct{} `pg:"document_types"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`

	FieldType string `pg:",notnull"`
	Type      string
}

type DocumentFieldValue struct {
	Field *DocumentField
	Value string
}

type DocumentRelation struct {
	tableName struct{} `pg:"document_types"`

	ID          uuid.UUID `pg:",type:uuid,pk"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`
	Type        string    `pg:",notnull"`

	From Document
	To   Document

	Fields []*DocumentField `json:"fields" pg:"many2many:workspaces_users"`
}

type DocumentRelationType struct {
	Name string
}

type DocumentFieldType struct {
	Name string
}

// DocumentMutation is currently unused.
type DocumentMutation struct {
}
