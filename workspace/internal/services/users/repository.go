package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/models"
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

func (r *UserRepository) create(user *models.User) (*models.User, error) {
	_, err := r.datastore.DB.Model(user).Returning("*").Insert()
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) remove(user *models.User) error {
	_, err := r.datastore.DB.Model(user).Where("id = ?", user.ID).Delete()

	return err
}

func (r *UserRepository) update(user *models.User) error {
	_, err := r.datastore.DB.Model(user).Update()

	return err
}
