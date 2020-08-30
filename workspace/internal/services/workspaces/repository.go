package workspaces

import (
	"github.com/go-pg/pg/v10/orm"
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/core-api/lib/models"
)

// WorkspaceRepository enables CRUD ops on the db for the Workspace objects.
type WorkspaceRepository struct {
	db orm.DB
}

func (r *WorkspaceRepository) getByID(id uuid.UUID) (*models.Workspace, error) {
	workspace := new(models.Workspace)

	err := r.db.Model(workspace).
		Relation("Users").
		Where("id = ?", id).
		Select()

	return workspace, err
}

func (r *WorkspaceRepository) create(workspace *models.Workspace) (*models.Workspace, error) {
	_, err := r.db.Model(workspace).Returning("*").Insert()
	if err != nil {
		return nil, err
	}

	return workspace, nil
}

func (r *WorkspaceRepository) remove(workspace *models.Workspace) error {
	_, err := r.db.Model(workspace).Where("id = ?", workspace.ID).Delete()

	return err
}

func (r *WorkspaceRepository) getAll() ([]models.Workspace, error) {
	var workspaces []models.Workspace

	err := r.db.Model(&workspaces).Select()

	return workspaces, err
}

func (r *WorkspaceRepository) update(workspace *models.Workspace) error {
	_, err := r.db.Model(workspace).Update()

	return err
}
