package api

import (
	"fmt"

	"github.com/labstack/echo"
)

type API struct {
	echo   *echo.Echo
	config *Config
}

func NewService(config *Config) (*API, error) {
	e := echo.New()

	api := API{e, config}

	return &api, nil
}

func (api *API) Run() {
	api.echo.Logger.Fatal(api.echo.Start(fmt.Sprintf(":%s", api.config.Port)))
}
