package workspaces

import (
	"strings"

	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/models"
)

// Workspaces struct holds all the dependencies required for the workspaces package. And exposes all services
// provided by this package as its methods
type Workspaces struct {
	datastore  *datastore.Datastore
	Repository *WorkspaceRepository
}

// NewService creates a new Workspaces service
func NewService(datastore *datastore.Datastore) (*Workspaces, error) {
	repository := &WorkspaceRepository{datastore.DB}

	w := &Workspaces{datastore, repository}

	return w, nil
}

// Create creates a new workspace
func (w *Workspaces) Create(workspace *models.Workspace) (*models.Workspace, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	workspace.ID = id
	return w.Repository.create(workspace)
}

// Get returns the models.Workspace with a given id
func (w *Workspaces) Get(id uuid.UUID) (*models.Workspace, error) {
	return w.Repository.getByID(id)
}

// SetName updates the name of a workspace
func (w *Workspaces) SetName(workspace *models.Workspace, newName string) error {
	if newName == workspace.Name {
		return nil
	}

	workspace.Name = newName

	return w.Repository.update(workspace)
}

// SetActive updates the active state of a workspace
func (w *Workspaces) SetActive(workspace *models.Workspace, isActive bool) error {
	if isActive == workspace.Active {
		return nil
	}

	workspace.Active = isActive

	return w.Repository.update(workspace)
}

// AddUser associates a user with a workspace
func (w *Workspaces) AddUser(user *models.User) error {
	return nil
}

// RemoveUser removes the association of a user with a workspace
func (w *Workspaces) RemoveUser(user *models.User) error {
	return nil
}

// Sanitize cleans up some fields on the workspace which may have "unclean" values
func (w *Workspaces) Sanitize(workspace *models.Workspace) {
	workspace.Name = strings.TrimSpace(workspace.Name)
}

// Validate checks that the workspace is valid that is contains no errors
func (w *Workspaces) Validate(workspace *models.Workspace) error {
	return nil
}
