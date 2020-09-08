package models

import (
	"time"

	"github.com/gofrs/uuid"
)

// Workspace holds all data required to represent a workspace
type Workspace struct {
	tableName struct{} `pg:"workspace"`

	ID     uuid.UUID `json:"id" pg:",type:uuid,pk,default:public.uuid_generate_v4()"`
	Name   string    `json:"name" pg:",notnull,unique"`
	Active bool      `json:"active" pg:"default: FALSE"`

	Users []*User `json:"users" pg:"many2many:workspace_user"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}
