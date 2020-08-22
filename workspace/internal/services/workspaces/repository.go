package workspaces

import (
	"github.com/go-pg/pg/orm"
	uuid "github.com/gofrs/uuid"
)

type WorkspaceRepository struct {
	db orm.DB
}

func (r *WorkspaceRepository) getByID(id uuid.UUID) (*Workspace, error) {
	workspace := new(Workspace)

	err := r.db.Model(workspace).
		Column("workspace.*").
		Relation("Users").
		Where("id = ?", id).
		Select()

	return workspace, err
}

func (r *WorkspaceRepository) create(workspace *Workspace) (*Workspace, error) {
	_, err := r.db.Model(workspace).Returning("*").Insert()
	if err != nil {
		return nil, err
	}

	return workspace, nil
}

func (r *WorkspaceRepository) remove(workspace *Workspace) error {
	_, err := r.db.Model(workspace).Where("id = ?", workspace.ID).Delete()

	return err
}

func (r *WorkspaceRepository) update(workspace *Workspace) error {
	_, err := r.db.Model(workspace).Update()

	return err
}
