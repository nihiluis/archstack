package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/models"
)

// UserRepository enables CRUD ops on the db for the User objects.
type UserRepository struct {
	datastore *datastore.Datastore
}

func (r *UserRepository) getByID(id uuid.UUID) (*models.User, error) {
	user := new(models.User)

	err := r.datastore.DB.Model(user).
		Relation("Workspaces").
		Where("id = ?", id).
		Select()

	return user, err
}

func (r *UserRepository) update(user *models.User) error {
	_, err := r.datastore.DB.Model(user).Update()

	return err
}
