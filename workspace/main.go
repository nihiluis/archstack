package main

import (
	"github.com/joho/godotenv"
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/logger"
	"gitlab.com/archstack/core-api/lib/models"
	"gitlab.com/archstack/core-api/lib/server/http"
	"gitlab.com/archstack/workspace-api/internal/api"
	"gitlab.com/archstack/workspace-api/internal/configs"
	"gitlab.com/archstack/workspace-api/internal/services/relationships"
	"gitlab.com/archstack/workspace-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
	"go.uber.org/zap"
)

func main() {
	err := godotenv.Load(".env")

	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	httpConfig, err := configs.HTTP()
	pgConfig, err := configs.Datastore()
	apiConfig, err := configs.API()

	logger := logger.NewService()

	datastore, err := datastore.NewService(pgConfig)
	if err != nil {
		panic(err)
	}

	models := []interface{}{(*models.Workspace)(nil), (*models.User)(nil), (*relationships.WorkspaceAndUser)(nil)}
	err = datastore.CreateSchema(models)
	if err != nil {
		panic(err)
	}

	defer datastore.DB.Close()

	workspaces, err := workspaces.NewService(datastore)
	if err != nil {
		panic(err)
	}

	users, err := users.NewService(datastore)
	if err != nil {
		panic(err)
	}

	relationships, err := relationships.NewService(datastore)
	if err != nil {
		panic(err)
	}

	server, err := http.NewEchoService(logger, httpConfig)
	if err != nil {
		panic(err)
	}

	api, err := api.NewService(logger, workspaces, users, relationships, apiConfig)
	if err != nil {
		panic(err)
	}
	api.AddHandlers(server)

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting", zap.String("port", httpConfig.Port))

	server.Start()
}
