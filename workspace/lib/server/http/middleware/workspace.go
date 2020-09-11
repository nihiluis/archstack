package middleware

import (
	"errors"

	"github.com/gofrs/uuid"

	"github.com/labstack/echo"
	"gitlab.com/archstack/core-api/lib/models"
)

type WorkspaceLimiterConfig struct {
	RequiredLevel int
	AuthUserKey   string
}

func WorkspaceLimiterWithConfig(config *WorkspaceLimiterConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get(config.AuthUserKey).(*models.User)
			if !ok {
				return errors.New("user must be present in context")
			}

			workspaceString := c.Request().Header.Get("X-Archstack-Workspace")
			if workspaceString == "" {
				return errors.New("workspace must be provided")
			}

			workspaceID, err := uuid.FromString(workspaceString)
			if err != nil {
				return errors.New("workspace id must be valid uuid")
			}

			return next(c)
		}
	}
}
