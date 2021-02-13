package configs

import (
	"os"
	"strings"
	"time"

	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/server/http"
	"gitlab.com/archstack/workspace-api/internal/api"
)

// Configs struct handles all dependencies required for handling configurations
type Configs struct {
}

// HTTP returns the configuration required for HTTP package
func (cfg *Configs) HTTP() (*http.Config, error) {
	allowOrigins := []string{"http://localhost:3000", "http://localhost:3001"}

	allowOrigins = append(allowOrigins, strings.Split(os.Getenv("ALLOW_ORIGINS"), "|")...)

	return &http.Config{
		Port:         os.Getenv("PORT"),
		AllowOrigins: allowOrigins,
	}, nil
}

// API returns the configuration required for the API package
func (cfg *Configs) API() (*api.Config, error) {
	return &api.Config{
		WorkspaceHeader: "Archstack-Workspace",
		AuthEndpointURL: os.Getenv("AUTH_URL"),
	}, nil
}

// Datastore returns datastore configuration
func (cfg *Configs) Datastore() (*datastore.Config, error) {
	return &datastore.Config{
		Host:   os.Getenv("DB_HOST"),
		Port:   os.Getenv("DB_PORT"),
		Driver: "postgres",

		StoreName: os.Getenv("DB_STORE"),
		Username:  os.Getenv("DB_USER"),
		Password:  os.Getenv("DB_PASSWORD"),

		SSLMode: "",

		ConnPoolSize: 10,
		ReadTimeout:  time.Second * 5,
		WriteTimeout: time.Second * 5,
		IdleTimeout:  time.Second * 60,
		DialTimeout:  time.Second * 10,
	}, nil
}

// NewService returns an instance of Config with all the required dependencies initialized
func NewService() (*Configs, error) {
	return &Configs{}, nil
}
