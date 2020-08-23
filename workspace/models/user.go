package models

import (
	"github.com/gofrs/uuid"
)

// User represents a user of the apps
type User struct {
	tableName struct{} `pg:"users"`

	ID        uuid.UUID `pg:",type:uuid,pk"`
	FirstName string    `json:"firstName" pg:",notnull"`
	LastName  string    `json:"lastName" pg:",notnull"`
	Mail      string    `json:"mail" pg:",notnull"`
	Level     int       `json:"level" pg:",notnull,default:0"`

	Password string `json:"-" pg:",notnull"`

	Workspaces []*Workspace `json:"workspaces" pg:"many2many:workspaces_users"`

	InvitedBy   *User         `json:"invitedBy" pg:"-"`
	InvitedByID uuid.NullUUID `json:"-" pg:",type:uuid"`
}
