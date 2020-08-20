package main

import (
	"gitlab.com/archstack/workspace-api/internal/configs"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/internal/server/http"
	"gitlab.com/archstack/workspace-api/internal/services/relationships"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
)

func main() {
	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	httpConfig, err := configs.HTTP()
	pgConfig, err := configs.Datastore()

	models := []interface{}{(*workspaces.Workspace)(nil), (*relationships.WorkspaceAndUser)(nil)}

	datastore, err := datastore.NewService(pgConfig)
	datastore.DB.RegisterTable((*relationships.WorkspaceAndUser)(nil))
	datastore.CreateSchema(models)
	defer datastore.DB.Close()

	http, err := http.NewService(httpConfig)

	http.Start()
}
