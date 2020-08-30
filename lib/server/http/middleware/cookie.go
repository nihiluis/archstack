package middleware

import (
	"github.com/labstack/echo/v4"
)

func UserCookieAuth() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()

			if req.Header.Get("Authorization") != "" {
				return next(c)
			}

			cookie, err := c.Cookie("token")

			if err != nil || cookie.Value == "" {
				return next(c)
			}

			token := cookie.Value

			req.Header.Set("Authorization", "Bearer "+token)

			return next(c)
		}
	}
}
