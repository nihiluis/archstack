package http

import (
	"fmt"

	"github.com/labstack/echo"
)

// Config holds all the configuration required to start the HTTP server
type Config struct {
	Host string
	Port string
}

type Handlers struct {
}

type Server struct {
	echo   *echo.Echo
	config *Config
}

func NewService(config *Config) (*Server, error) {
	e := echo.New()
	e.HideBanner = true

	server := Server{e, config}

	return &server, nil
}

func (server *Server) Start() {
	server.echo.Logger.Fatal(server.echo.Start(fmt.Sprintf(":%s", server.config.Port)))
}

func (server *Server) InitRoutes() {

}
