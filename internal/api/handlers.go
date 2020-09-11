package api

import (
	"net/http"

	"github.com/dghubble/sling"
	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"gitlab.com/archstack/core-api/lib/logger"
	archhttp "gitlab.com/archstack/core-api/lib/server/http"
	"gitlab.com/archstack/core-api/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	logger   *logger.Logger
	validate *validator.Validate
	config   *Config
}

type Config struct {
	GraphQLEndpointURL string
}

func NewService(logger *logger.Logger, config *Config) (*API, error) {
	validate := validator.New()

	return &API{logger, validate, config}, nil
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
		AuthEndpointURL: "http://localhost:3333",
	}
	userAuthMiddleware := middleware.UserAuthWithConfig(userAuthConfig)

	s.Echo.Use(userCookieAuthMiddleware)
	s.Echo.Use(userAuthMiddleware)

	s.Echo.Use(userCookieAuthMiddleware)
	s.Echo.Use(userAuthMiddleware)

	s.Echo.POST("/graphql", api.handleGraphQLQuery)
}

// GraphQLQueryRequestBody contains the graphql query.
type GraphQLQueryRequestBody struct {
	Query string `json:"query" validate:"required"`
}

func (api *API) handleGraphQLQuery(c echo.Context) error {
	var data map[string]interface{}

	_, err := sling.New().Post(api.config.GraphQLEndpointURL).Body(c.Request().Body).ReceiveSuccess(&data)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}
