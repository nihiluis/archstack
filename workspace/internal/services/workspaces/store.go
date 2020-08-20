package workspaces

import (
	uuid "github.com/satori/go.uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
)

type store struct {
	datastore *datastore.Datastore
}

func (store *store) getByID(id uuid.UUID) (*Workspace, error) {
	workspace := new(Workspace)

	err := store.datastore.DB.Model(workspace).Where("id = ?", id).Select()

	return workspace, err
}

func (store *store) create(workspace *Workspace) (*Workspace, error) {
	_, err := store.datastore.DB.Model(workspace).Returning("*").Insert()
	if err != nil {
		return nil, err
	}

	return workspace, nil
}

func (store *store) remove(workspace *Workspace) error {
	_, err := store.datastore.DB.Model(workspace).Where("id = ?", workspace.ID).Delete()

	return err
}

func (store *store) update(workspace *Workspace) error {
	_, err := store.datastore.DB.Model(workspace).Update()

	return err
}
