package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/models"
)

// Users struct holds all the dependencies required for the workspaces package. And exposes all services
// provided by this package as its methods
type Users struct {
	Repository UserRepository
}

// NewService creates a new Users service
func NewService(datastore *datastore.Datastore) (*Users, error) {
	repo := UserRepository{datastore}

	w := &Users{repo}

	return w, nil
}

// Create creates a new user
func (u *Users) Create(user *models.User) (*models.User, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	user.ID = id

	return u.Repository.create(user)
}
