package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
)

// User represents a user of the apps
type User struct {
	tableName struct{} `sql:"users"`

	ID        uuid.UUID `sql:",pk,type:uuid"`
	FirstName string    `json:"firstName" sql:",notnull"`
	LastName  string    `json:"lastName" sql:",notnull"`
	Mail      string    `json:"mail" sql:",notnull"`
	Level     int       `json:"level" sql:",notnull,default:0"`

	Password string `json:"-" sql:",notnull"`

	InvitedBy   *User     `json:"invitedBy" sql:"-"`
	InvitedByID uuid.UUID `json:"-" sql:",type:uuid"`
}

// Users struct holds all the dependencies required for the workspaces package. And exposes all services
// provided by this package as its methods
type Users struct {
	Store Store
}

// NewService creates a new Users service
func NewService(datastore *datastore.Datastore) (*Users, error) {
	store := Store{datastore}

	w := &Users{store}

	return w, nil
}

// Create creates a new user
func (u *Users) Create(user *User) (*User, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	user.ID = id

	return u.Store.create(user)
}
