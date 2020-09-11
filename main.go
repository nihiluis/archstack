package main

import (
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/logger"
	"gitlab.com/archstack/core-api/lib/models"
	"gitlab.com/archstack/core-api/lib/server/http"
	"gitlab.com/archstack/inventory-api/internal/api"
	"gitlab.com/archstack/inventory-api/internal/configs"
	"go.uber.org/zap"
)

func main() {
	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()

	pgConfig, err := configs.Datastore()
	httpConfig, err := configs.HTTP()
	apiConfig, err := configs.API()

	datastore, err := datastore.NewService(pgConfig)
	if err != nil {
		panic(err)
	}
	defer datastore.DB.Close()

	models := []interface{}{
		(*models.Document)(nil),
		(*models.DocumentType)(nil),
		(*models.DocumentField)(nil),
		(*models.DocumentFieldValue)(nil),
	}
	err = datastore.CreateSchema(models)
	if err != nil {
		panic(err)
	}

	server, err := http.NewEchoService(logger, httpConfig)
	if err != nil {
		panic(err)
	}

	api, err := api.NewService(logger, apiConfig)
	if err != nil {
		panic(err)
	}
	api.AddHandlers(server)

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting on", zap.String("port", httpConfig.Port))

	server.Start()
}
