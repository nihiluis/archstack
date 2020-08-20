package users

import (
	uuid "github.com/satori/go.uuid"
)

// User represents a user of the apps
type User struct {
	tableName struct{} `sql:"users"`

	ID        uuid.UUID `json:"-" pg:"id, type:uuid, pk"`
	FirstName string    `json:"firstName" pg:",notnull"`
	LastName  string    `json:"lastName" pg:",notnull"`
	Mail      string    `json:"mail" pg:",notnull"`
	Level     int       `json:"level" pg:",notnull"`

	InvitedBy   *User     `json:"invitedBy" pg:"-"`
	InvitedByID uuid.UUID `json:"-" pg:",notnull"`
}

// MapUsersToIDs turns an array of users into an array of uuids by their ids
func MapUsersToIDs(vs []User) []uuid.UUID {
	vsm := make([]uuid.UUID, len(vs))
	for i, v := range vs {
		vsm[i] = v.ID
	}
	return vsm
}
