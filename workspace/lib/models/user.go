package models

import (
	"github.com/gofrs/uuid"
)

// User represents a user of the apps
type User struct {
	tableName struct{} `pg:"users"`

	ID     uuid.UUID `pg:",type:uuid,pk"`
	AuthID uuid.UUID `pg:",type:uuid,unique:idx_auth_id"`

	Level int `json:"level" pg:",notnull,default:0"`

	Workspaces []*Workspace `json:"workspaces" pg:"many2many:workspaces_users"`

	InvitedBy   *User         `json:"invitedBy" pg:"-"`
	InvitedByID uuid.NullUUID `json:"-" pg:",type:uuid"`
}
