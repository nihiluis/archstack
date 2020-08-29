package handlers

import (
	"github.com/go-playground/validator"
	"gitlab.com/archstack/workspace-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
	"gitlab.com/archstack/workspace-api/lib/logger"
	archhttp "gitlab.com/archstack/workspace-api/lib/server/http"
	"gitlab.com/archstack/workspace-api/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	users      *users.Users
	workspaces *workspaces.Workspaces
	logger     *logger.Logger
	validate   *validator.Validate
}

func NewService(logger *logger.Logger, workspaces *workspaces.Workspaces, users *users.Users) (*API, error) {
	validate := validator.New()

	return &API{users, workspaces, logger, validate}, nil
}

// AddHandlers adds the echo handlers that are part of this package.
func (api *API) AddHandlers(s *archhttp.EchoServer) {
	middleware.AuthWithConfig(middleware.AuthConfig{
		AuthEndpointURL: "http://localhost:3333",
	})
}
