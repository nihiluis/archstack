package relationships

import (
	"errors"

	"github.com/go-pg/pg/v10/orm"
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/models"
)

type RelationshipRepository struct {
	datastore *datastore.Datastore
}

func init() {
	orm.RegisterTable((*models.WorkspaceAndUser)(nil))
}

func (r *RelationshipRepository) AddWorkspaceUser(workspaceAndUser *models.WorkspaceAndUser) error {
	rel := new(models.WorkspaceAndUser)

	count, err := r.datastore.DB.Model(rel).
		Where("workspace_id = ?", workspaceAndUser.WorkspaceID).
		Where("user_id = ?", workspaceAndUser.UserID).
		Count()

	if err != nil {
		return err
	}

	if count > 0 {
		return errors.New("WorkspaceUser already exists")
	}

	r.datastore.DB.Model(workspaceAndUser).Insert()

	return nil
}

func (r *RelationshipRepository) DeleteWorkspaceUser(workspaceAndUser *models.WorkspaceAndUser) error {
	_, err := r.datastore.DB.Model(workspaceAndUser).Delete()

	return err
}

func (r *RelationshipRepository) IsUserAssignedToWorkspace(workspaceAndUser *models.WorkspaceAndUser) (bool, error) {
	return r.datastore.DB.Model(workspaceAndUser).Exists()
}
