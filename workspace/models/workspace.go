package models

import (
	"time"

	"github.com/gofrs/uuid"
)

// Workspace holds all data required to represent a workspace
type Workspace struct {
	tableName struct{} `pg:"workspaces"`

	ID     uuid.UUID `json:"-" pg:",type:uuid, pk"`
	Name   string    `json:"firstName" pg:",notnull,unique"`
	Active bool      `json:"active" pg:"default: FALSE"`

	Users []*User `json:"users" pg:"many2many:workspaces_users"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}
