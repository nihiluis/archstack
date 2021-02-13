package api

import (
	"errors"
	"net/http"

	"gitlab.com/archstack/workspace-api/internal/services/relationships"

	"github.com/go-playground/validator"
	"github.com/gofrs/uuid"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"gitlab.com/archstack/core-api/lib/logger"
	"gitlab.com/archstack/core-api/lib/models"
	archhttp "gitlab.com/archstack/core-api/lib/server/http"
	"gitlab.com/archstack/core-api/lib/server/http/middleware"
	"gitlab.com/archstack/workspace-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
	workspaceMiddleware "gitlab.com/archstack/workspace-api/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	users         *users.Users
	workspaces    *workspaces.Workspaces
	relationships *relationships.Relationships
	logger        *logger.Logger
	validate      *validator.Validate
	config        *Config
}

type Config struct {
	WorkspaceHeader string
	AuthEndpointURL string
}

func NewService(logger *logger.Logger,
	workspaces *workspaces.Workspaces,
	users *users.Users,
	relationships *relationships.Relationships,
	config *Config) (*API, error) {
	validate := validator.New()

	return &API{users, workspaces, relationships, logger, validate, config}, nil
}

// AddHandlers adds the echo handlers that are part of this package.
func (api *API) AddHandlers(s *archhttp.EchoServer) {
	s.Echo.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     s.Config.AllowOrigins,
		AllowCredentials: true,
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	userCookieAuthMiddleware := middleware.UserCookieAuth()

	userAuthConfig := &middleware.UserAuthConfig{
		AuthEndpointURL: api.config.AuthEndpointURL,
	}
	userAuthMiddleware := middleware.UserAuthWithConfig(userAuthConfig)

	userLevelConfig := &middleware.UserLevelConfig{
		RequiredLevel: 1,
	}
	userLevelMiddleware := middleware.UserLevelWithConfig(userLevelConfig, userAuthConfig)

	s.Echo.Use(userCookieAuthMiddleware)
	s.Echo.Use(userAuthMiddleware)

	adminGroup := s.Echo.Group("/admin")

	adminGroup.Use(userLevelMiddleware)

	adminGroup.POST("/create", api.createWorkspace)
	adminGroup.GET("/all", api.getWorkspaces)
	adminGroup.POST("/user/assign", api.assignUser)
	adminGroup.POST("/user/isassigned", api.isUserAssignedToWorkspace)

	userGroup := s.Echo.Group("/user")

	userGroup.Use(userCookieAuthMiddleware)
	userGroup.Use(userAuthMiddleware)

	userGroup.GET("/workspaces", api.getWorkspacesForUser)

	workspaceLimiterConfig := &workspaceMiddleware.WorkspaceLimiterConfig{}
	workspaceMiddleware := workspaceMiddleware.WorkspaceLimiterWithConfig(workspaceLimiterConfig)

	s.Echo.GET("/get", api.getWorkspace, workspaceMiddleware)
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

func (api *API) getWorkspace(c echo.Context) error {
	idString := c.Request().Header.Get(api.config.WorkspaceHeader)
	if idString == "" {
		return errors.New("workspace must be provided with header")
	}

	id, err := uuid.FromString(idString)
	if err != nil {
		return err
	}

	workspace, err := api.workspaces.GetByID(id)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"workspace": workspace})
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

// IsUserAssignedToWorkspaceRequestBody is the JSON body of a request to the isUserAssignedToWorkspace handler.
type IsUserAssignedToWorkspaceRequestBody struct {
	UserID      uuid.UUID `json:"userId" validate:"required"`
	WorkspaceID uuid.UUID `json:"workspaceId" validate:"required"`
}

func (api *API) isUserAssignedToWorkspace(c echo.Context) error {
	body := new(IsUserAssignedToWorkspaceRequestBody)
	if err := c.Bind(body); err != nil {
		return err
	}
	err := api.validate.Struct(body)
	if err != nil {
		return err
	}

	userID := body.UserID
	workspaceID := body.WorkspaceID

	isAssigned, err := api.relationships.IsUserAssignedToWorkspace(userID, workspaceID)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{"isAssigned": isAssigned})
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
