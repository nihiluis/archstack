package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
)

type Store struct {
	datastore *datastore.Datastore
}

func (s *Store) getByID(id uuid.UUID) (*User, error) {
	user := new(User)

	err := s.datastore.DB.Model(user).Where("id = ?", id).Select()

	return user, err
}

func (s *Store) create(user *User) (*User, error) {
	_, err := s.datastore.DB.Model(user).Returning("*").Insert()
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Store) remove(user *User) error {
	_, err := s.datastore.DB.Model(user).Where("id = ?", user.ID).Delete()

	return err
}

func (s *Store) update(user *User) error {
	_, err := s.datastore.DB.Model(user).Update()

	return err
}
