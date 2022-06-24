package middleware

import (
	"errors"

	"github.com/gofrs/uuid"

	"github.com/labstack/echo/v4"
	"gitlab.com/archstack/core-api/lib/models"
)

type WorkspaceLimiterConfig struct {
	AuthUserKey     string
	WorkspaceKey    string
	WorkspaceHeader string
}

func WorkspaceLimiterWithConfig(config *WorkspaceLimiterConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		if config.AuthUserKey == "" {
			config.AuthUserKey = "user"
		}

		if config.WorkspaceKey == "" {
			config.WorkspaceKey = "workspace"
		}

		if config.WorkspaceHeader == "" {
			config.WorkspaceHeader = "Archstack-Workspace"
		}

		return func(c echo.Context) error {
			user, ok := c.Get(config.AuthUserKey).(*models.User)
			if !ok {
				return errors.New("user must be present in context")
			}

			workspaceString := c.Request().Header.Get(config.WorkspaceHeader)
			if workspaceString == "" {
				return errors.New("workspace must be provided")
			}

			workspaceID, err := uuid.FromString(workspaceString)
			if err != nil {
				return errors.New("workspace id must be valid uuid")
			}

			for _, v := range user.Workspaces {
				if workspaceID == v.ID {
					c.Set(config.WorkspaceKey, workspaceID)
					return next(c)
				}
			}

			return errors.New("not authorized to access workspace " + workspaceString)
		}
	}
}
