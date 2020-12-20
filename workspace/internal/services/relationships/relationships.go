package relationships

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/models"
)

// Relationships struct holds all the dependencies required for the relationships package. And exposes all services
// provided by this package as its methods
type Relationships struct {
	Repository RelationshipRepository
}

// NewService creates a new Relationships service
func NewService(datastore *datastore.Datastore) (*Relationships, error) {
	repo := RelationshipRepository{datastore}

	r := &Relationships{repo}

	return r, nil
}

// WorkspaceAndUser represents a many to many relationship between workspaces and users
type WorkspaceAndUser struct {
	tableName struct{} `pg:"workspace_user"`

	WorkspaceID uuid.UUID `pg:",type:uuid,unique:idx_workspace_id_user_id"`
	UserID      uuid.UUID `pg:",type:uuid,unique:idx_workspace_id_user_id"`
}

// NewWorkspaceAndUser returns an instance of the WorkspaceAndUser many to many relationship
func NewWorkspaceAndUser(workspace *models.Workspace, user *models.User) WorkspaceAndUser {
	return WorkspaceAndUser{WorkspaceID: workspace.ID, UserID: user.ID}
}

// AssignUserToWorkspace assigns a user to a workspace
func (r *Relationships) AssignUserToWorkspace(user *models.User, workspace *models.Workspace) error {
	rel := NewWorkspaceAndUser(workspace, user)

	err := r.Repository.AddWorkspaceUser(&rel)

	return err
}

func (r *Relationships) IsUserAssignedToWorkspace(userID uuid.UUID, workspaceID uuid.UUID) (bool, error) {
	rel := &WorkspaceAndUser{WorkspaceID: workspaceID, UserID: userID}

	return r.Repository.IsUserAssignedToWorkspace(rel)
}
