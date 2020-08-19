package main

import (
	"gitlab.com/archstack/workspace-api/internal/configs"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/internal/server/http"
)

func main() {
	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	httpConfig, err := configs.HTTP()
	pgConfig, err := configs.Datastore()

	datastore, err := datastore.NewService(pgConfig)
	http, err := http.NewService(httpConfig)

	http.Start()
}
