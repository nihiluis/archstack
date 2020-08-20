package workspaces

import (
	"strings"
	"time"

	uuid "github.com/satori/go.uuid"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/internal/services/users"
)

// Workspace holds all data required to represent a workspace
type Workspace struct {
	tableName struct{} `sql:"workspaces"`

	ID     uuid.UUID `json:"-" pg:"id, type:uuid, default:gen_random_uuid()"`
	Name   string    `json:"firstName" pg:",notnull,unique"`
	Active bool      `json:"active" pg:"default: FALSE"`

	Users []*users.User `json:"users" pg:"many2many:workspace_user,join_fk:user_id"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}

// Sanitize cleans up some fields on the workspace which may have "unclean" values
func (w *Workspace) Sanitize() {
	w.Name = strings.TrimSpace(w.Name)
}

// Validate checks that the workspace is valid that is contains no errors
func (w *Workspace) Validate() error {
	return nil
}

// Workspaces struct holds all the dependencies required for the workspaces package. And exposes all services
// provided by this package as its methods
type Workspaces struct {
	store store
}

// NewService creates a new Workspaces service
func NewService(datastore *datastore.Datastore) (*Workspaces, error) {
	store := store{datastore}

	w := &Workspaces{store}

	return w, nil
}

// Create creates a new workspace
func (w *Workspaces) Create(workspace *Workspace) (*Workspace, error) {
	return w.store.create(workspace)
}

// Get returns the Workspace with a given id
func (w *Workspaces) Get(id uuid.UUID) (*Workspace, error) {
	return w.store.getByID(id)
}

// SetName updates the name of a workspace
func (w *Workspaces) SetName(workspace *Workspace, newName string) error {
	if newName == workspace.Name {
		return nil
	}

	workspace.Name = newName

	return w.store.update(workspace)
}

// SetActive updates the active state of a workspace
func (w *Workspaces) SetActive(workspace *Workspace, isActive bool) error {
	if isActive == workspace.Active {
		return nil
	}

	workspace.Active = isActive

	return w.store.update(workspace)
}

// AddUser associates a user with a workspace
func (w *Workspaces) AddUser(user *users.User) error {
	return nil
}

// RemoveUser removes the association of a user with a workspace
func (w *Workspaces) RemoveUser(user *users.User) error {
	return nil
}
