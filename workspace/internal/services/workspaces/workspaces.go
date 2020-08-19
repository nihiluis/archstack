package workspaces

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gitlab.com/archstack/workspace-api/internal/services/users"
)

type Workspace struct {
	tableName struct{} `sql:"workspaces"`

	ID        uuid.UUID `json:"-" pg:"id, type:uuid"`
	Name      string    `json:"firstName"`
	Level     int       `json:"level"`
	CreatedAt time.Time `json:"createdAt"`

	Users    []*users.User `json:"users" pg:"-"`
	UserList []uuid.UUID   `json:"-" pg:"-,array"`
}
