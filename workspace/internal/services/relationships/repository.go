package relationships

import (
	"errors"

	"github.com/go-pg/pg/v10/orm"
	"gitlab.com/archstack/workspace-api/lib/datastore"
)

type RelationshipRepository struct {
	datastore *datastore.Datastore
}

func init() {
	orm.RegisterTable((*WorkspaceAndUser)(nil))
}

func (r *RelationshipRepository) AddWorkspaceUser(workspaceAndUser *WorkspaceAndUser) error {
	rel := new(WorkspaceAndUser)

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

func (r *RelationshipRepository) DeleteWorkspaceUser(workspaceAndUser *WorkspaceAndUser) error {
	_, err := r.datastore.DB.Model(workspaceAndUser).Delete()

	return err
}
