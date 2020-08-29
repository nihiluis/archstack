package main

import (
	"gitlab.com/archstack/workspace-api/internal/configs"
	"gitlab.com/archstack/workspace-api/internal/services/relationships"
	"gitlab.com/archstack/workspace-api/lib/datastore"
	"gitlab.com/archstack/workspace-api/lib/logger"
	"gitlab.com/archstack/workspace-api/lib/models"
	"gitlab.com/archstack/workspace-api/lib/server/http"
	"go.uber.org/zap"
)

func main() {
	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	httpConfig, err := configs.HTTP()
	pgConfig, err := configs.Datastore()

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

	http, err := http.NewEchoService(logger, httpConfig)
	if err != nil {
		panic(err)
	}

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting", zap.String("port", httpConfig.Port))
	http.Start()
}
