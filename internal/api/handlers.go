package api

import (
	"net/http"

	"github.com/dghubble/sling"
	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"gitlab.com/archstack/core-api/lib/logger"
	archhttp "gitlab.com/archstack/core-api/lib/server/http"
	userMiddleware "gitlab.com/archstack/core-api/lib/server/http/middleware"
	workspaceMiddleware "gitlab.com/archstack/workspace-api/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	logger   *logger.Logger
	validate *validator.Validate
	config   *Config
}

type Config struct {
	GraphQLEndpointURL     string
	GraphQLWorkspaceHeader string
	GraphQLRoleHeader      string
	GraphQLRoleName        string
	WorkspaceContextKey    string
}

func NewService(logger *logger.Logger, config *Config) (*API, error) {
	validate := validator.New()

	return &API{logger, validate, config}, nil
}

// AddHandlers adds the echo handlers that are part of this package.
func (api *API) AddHandlers(s *archhttp.EchoServer) {
	s.Echo.Use(echoMiddleware.Logger())

	s.Echo.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     s.Config.AllowOrigins,
		AllowCredentials: true,
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	userCookieAuthMiddleware := userMiddleware.UserCookieAuth()
	s.Echo.Use(userCookieAuthMiddleware)

	userAuthConfig := &userMiddleware.UserAuthConfig{
		AuthEndpointURL: "http://localhost:3333",
	}
	userAuthMiddleware := userMiddleware.UserAuthWithConfig(userAuthConfig)

	s.Echo.Use(userAuthMiddleware)

	workspaceLimiterConfig := &workspaceMiddleware.WorkspaceLimiterConfig{}
	workspaceMiddleware := workspaceMiddleware.WorkspaceLimiterWithConfig(workspaceLimiterConfig)

	s.Echo.Use(workspaceMiddleware)

	s.Echo.POST("/graphql", api.handleGraphQLQuery)
}

// GraphQLQueryRequestBody contains the graphql query.
type GraphQLQueryRequestBody struct {
	Query string `json:"query" validate:"required"`
}

// handleGraphQLQuery handles a wrapper endpoint for the Hasura GraphQL engine. This imposes some performance penalties,
// but allows for greater developer productivity as no dabbling with the token claims in Keycloak is needed. Furthermore,
// the keycloak-hasura-connector can be omitted.
// At some point this endpoint might become legacy.
func (api *API) handleGraphQLQuery(c echo.Context) error {
	var data map[string]interface{}

	//workspaceID := c.Get(api.config.WorkspaceContextKey).(uuid.UUID)

	s := sling.New().Post(api.config.GraphQLEndpointURL).
		Set(api.config.GraphQLWorkspaceHeader, "04c5198e-8eea-43e1-b3bc-a6fcdc73b064").
		Set(api.config.GraphQLRoleHeader, api.config.GraphQLRoleName)
	_, err := s.Body(c.Request().Body).ReceiveSuccess(&data)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}
