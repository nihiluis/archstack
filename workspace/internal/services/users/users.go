package users

import (
	uuid "github.com/satori/go.uuid"
)

type User struct {
	tableName struct{} `sql:"users"`

	ID        uuid.UUID `json:"-" pg:"id, type:uuid"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Mail      string    `json:"mail"`
	Level     int       `json:"level"`

	InvitedBy   *User     `json:"invitedBy" pg:"-"`
	InvitedByID uuid.UUID `json:"-"`
}
