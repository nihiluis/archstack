package configs

import (
	"time"

	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/internal/server/http"
)

// TestConfigs struct handles all dependencies required for handling configurations
type TestConfigs struct {
}

// HTTP returns the test configuration required for HTTP package
func (cfg *TestConfigs) HTTP() (*http.Config, error) {
	return &http.Config{
		Port: "8081",
	}, nil
}

// Datastore returns test datastore configuration
func (cfg *TestConfigs) Datastore() (*datastore.Config, error) {
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

// NewTestService returns an instance of Config with all the required dependencies initialized
func NewTestService() (*TestConfigs, error) {
	return &TestConfigs{}, nil
}
