package configs

import (
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
	return &http.Config{
		Port:         "3334",
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
	}, nil
}

// API returns the configuration required for the API package
func (cfg *Configs) API() (*api.Config, error) {
	return &api.Config{
		WorkspaceHeader: "Archstack-Workspace",
	}, nil
}

// Datastore returns datastore configuration
func (cfg *Configs) Datastore() (*datastore.Config, error) {
	return &datastore.Config{
		Host:   "localhost",
		Port:   "5432",
		Driver: "postgres",

		StoreName: "archstack",
		Username:  "",
		Password:  "",

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
