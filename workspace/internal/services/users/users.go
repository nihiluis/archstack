package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/lib/datastore"
	"gitlab.com/archstack/workspace-api/lib/models"
)

// Users struct holds all the dependencies required for the users package. And exposes all services
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

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		return nil, err
	}

	user.Password = hashedPassword

	return u.Repository.create(user)
}
