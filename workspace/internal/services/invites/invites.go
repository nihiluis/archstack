package invites

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gitlab.com/archstack/workspace-api/internal/services/users"
)

type Invite struct {
	tableName struct{} `sql:"invites"`

	ID    uuid.UUID `json:"-" pg:"id, type:uuid"`
	Mail  string    `json:"firstName"`
	Level int       `json:"level"`

	ValidTo time.Time `json:"validTo"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	InvitedBy   *users.User `json:"invitedBy" pg:"-"`
	InvitedByID uuid.UUID   `json:"-"`
}
