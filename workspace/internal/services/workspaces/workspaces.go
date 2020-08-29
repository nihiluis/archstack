package workspaces

import (
	"strings"

	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/lib/datastore"
	"gitlab.com/archstack/workspace-api/lib/models"
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

// GetByID returns the models.Workspace with a given id
func (w *Workspaces) GetByID(id uuid.UUID) (*models.Workspace, error) {
	return w.Repository.getByID(id)
}

// GetAll returns all models.Workspace
func (w *Workspaces) GetAll() ([]models.Workspace, error) {
	return w.Repository.getAll()
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

// Sanitize cleans up some fields on the workspace which may have "unclean" values
func (w *Workspaces) sanitize(workspace *models.Workspace) {
	workspace.Name = strings.TrimSpace(workspace.Name)
}

// Validate checks that the workspace is valid that is contains no errors
func (w *Workspaces) validate(workspace *models.Workspace) error {
	return nil
}
