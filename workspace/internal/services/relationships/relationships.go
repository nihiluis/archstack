package relationships

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
)

// Relationships struct holds all the dependencies required for the relationships package. And exposes all services
// provided by this package as its methods
type Relationships struct {
	Repository RelationshipRepository
}

// NewService creates a new Relationships service
func NewService(datastore *datastore.Datastore) (*Relationships, error) {
	repo := RelationshipRepository{datastore}

	w := &Relationships{repo}

	return w, nil
}

// WorkspaceAndUser represents a many to many relationship between workspaces and users
type WorkspaceAndUser struct {
	tableName struct{} `sql:"workspace_user"`

	WorkspaceID uuid.UUID `sql:",type:uuid,unique:idx_workspace_id_user_id"`
	UserID      uuid.UUID `sql:",type:uuid,unique:idx_workspace_id_user_id"`
}

// NewWorkspaceAndUser returns an instance of the WorkspaceAndUser many to many relationship
func NewWorkspaceAndUser(workspace *workspaces.Workspace, user *users.User) WorkspaceAndUser {
	return WorkspaceAndUser{WorkspaceID: workspace.ID, UserID: user.ID}
}
