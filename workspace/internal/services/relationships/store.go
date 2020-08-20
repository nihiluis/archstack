package relationships

import (
	"errors"

	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
)

type store struct {
	datastore *datastore.Datastore
}

func (store *store) addWorkspaceUser(workspaceAndUser *WorkspaceAndUser) error {
	rel := new(WorkspaceAndUser)

	count, err := store.datastore.DB.Model(rel).
		Where("workspace_id = ?", workspaceAndUser.WorkspaceID).
		Where("user_id = ?", workspaceAndUser.UserID).
		Count()

	if err != nil {
		return err
	}

	if count > 0 {
		return errors.New("WorkspaceUser already exists")
	}

	store.datastore.DB.Model(workspaceAndUser).Insert()

	return nil
}

func (store *store) deleteWorkspaceUser(workspaceAndUser *WorkspaceAndUser) error {
	_, err := store.datastore.DB.Model(workspaceAndUser).Delete()

	return err
}
