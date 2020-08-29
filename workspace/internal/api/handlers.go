package api

import (
	"errors"
	"net/http"

	"gitlab.com/archstack/workspace-api/internal/services/relationships"

	"github.com/go-playground/validator"
	"github.com/gofrs/uuid"
	"github.com/labstack/echo/v4"
	"gitlab.com/archstack/workspace-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
	"gitlab.com/archstack/workspace-api/lib/logger"
	"gitlab.com/archstack/workspace-api/lib/models"
	archhttp "gitlab.com/archstack/workspace-api/lib/server/http"
	"gitlab.com/archstack/workspace-api/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	users         *users.Users
	workspaces    *workspaces.Workspaces
	relationships *relationships.Relationships
	logger        *logger.Logger
	validate      *validator.Validate
}

func NewService(logger *logger.Logger,
	workspaces *workspaces.Workspaces,
	users *users.Users,
	relationships *relationships.Relationships) (*API, error) {
	validate := validator.New()

	return &API{users, workspaces, relationships, logger, validate}, nil
}

// AddHandlers adds the echo handlers that are part of this package.
func (api *API) AddHandlers(s *archhttp.EchoServer) {
	userAuthConfig := &middleware.UserAuthConfig{
		AuthEndpointURL: "http://localhost:3333",
	}
	userAuthMiddleware := middleware.UserAuthWithConfig(userAuthConfig)

	userLevelConfig := &middleware.UserLevelConfig{
		RequiredLevel: 1,
	}
	userLevelMiddleware := middleware.UserLevelWithConfig(userLevelConfig, userAuthConfig)

	workspaceGroup := s.Echo.Group("/workspace")
	userGroup := s.Echo.Group("/user")

	workspaceGroup.Use(userAuthMiddleware)
	workspaceGroup.Use(userLevelMiddleware)

	userGroup.Use(userAuthMiddleware)

	workspaceGroup.POST("/create", api.createWorkspace)
	workspaceGroup.GET("/all", api.getWorkspaces)
	userGroup.GET("/workspaces", api.getWorkspacesForUser)
	workspaceGroup.POST("/user/assign", api.assignUser)
}

// CreateWorkspaceRequestBody is the JSON body of a request to the createWorkspace handler.
type CreateWorkspaceRequestBody struct {
	Name string `json:"name" validate:"required"`
}

func (api *API) createWorkspace(c echo.Context) error {
	body := new(CreateWorkspaceRequestBody)
	if err := c.Bind(body); err != nil {
		return err
	}
	err := api.validate.Struct(body)
	if err != nil {
		return err
	}

	name := body.Name

	workspace := &models.Workspace{
		Name: name,
	}

	workspace, err = api.workspaces.Create(workspace)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"workspace": workspace})
}

func (api *API) getWorkspaces(c echo.Context) error {
	workspaces, err := api.workspaces.GetAll()
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"workspaces": workspaces})
}

// AssignUserToWorkspaceRequestBody is the JSON body of a request to the createWorkspace handler.
type AssignUserToWorkspaceRequestBody struct {
	UserID      uuid.UUID `json:"userId" validate:"required"`
	WorkspaceID uuid.UUID `json:"workspaceId" validate:"required"`
}

func (api *API) assignUser(c echo.Context) error {
	body := new(AssignUserToWorkspaceRequestBody)
	if err := c.Bind(body); err != nil {
		return err
	}
	err := api.validate.Struct(body)
	if err != nil {
		return err
	}

	userID := body.UserID
	workspaceID := body.WorkspaceID

	user, err := api.users.GetByID(userID)
	if err != nil {
		return err
	}

	workspace, err := api.workspaces.GetByID(workspaceID)
	if err != nil {
		return err
	}

	api.relationships.AssignUserToWorkspace(user, workspace)

	return c.JSON(http.StatusOK, echo.Map{})
}

func (api *API) getWorkspacesForUser(c echo.Context) error {
	userID, ok := c.Get("dataUserID").(uuid.UUID)
	if !ok {
		return errors.New("userID may not be null")
	}

	user, err := api.users.GetByID(userID)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"workspaces": user.Workspaces})
}
