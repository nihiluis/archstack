package invites

import (
	"time"

	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/core-api/lib/models"
)

type Invite struct {
	tableName struct{} `sql:"invites"`

	ID    uuid.UUID `json:"-" pg:"id, type:uuid, notnull"`
	Mail  string    `json:"firstName" pg:",notnull"`
	Level int       `json:"level" pg:",notnull"`

	ValidTo time.Time `json:"validTo" pg:",notnull"`

	CreatedAt time.Time `json:"createdAt" pg:",notnull"`
	UpdatedAt time.Time `json:"updatedAt" pg:",notnull"`

	InvitedBy   *models.User `json:"invitedBy" pg:"-"`
	InvitedByID uuid.UUID    `json:"-" pg:",notnull"`
}
