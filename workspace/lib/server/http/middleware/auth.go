package middleware

import (
	"github.com/dghubble/sling"
	"github.com/gofrs/uuid"
	"github.com/labstack/echo/v4"
)

type AuthConfig struct {
	AuthEndpointURL string
	AuthUserIDKey   string
	DataUserIDKey   string
}

func AuthWithConfig(config AuthConfig) echo.MiddlewareFunc {
	if config.AuthUserIDKey == "" {
		config.AuthUserIDKey = "authUserID"
	}
	if config.DataUserIDKey == "" {
		config.DataUserIDKey = "dataUserID"
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")

			authData, err := callAuth(config.AuthEndpointURL, authHeader)
			if err != nil {
				return err
			}

			c.Set(config.AuthUserIDKey, authData.AuthUserID)
			c.Set(config.DataUserIDKey, authData.DataUserID)

			return next(c)
		}
	}
}

type AuthData struct {
	AuthUserID uuid.UUID `json:"authUserId"`
	DataUserID uuid.UUID `json:"userId"`
}

func callAuth(url string, authHeader string) (*AuthData, error) {
	data := new(AuthData)

	_, err := sling.New().Set("Authorization", authHeader).Get(url).ReceiveSuccess(data)
	if err != nil {
		return nil, err
	}

	return data, nil
}
