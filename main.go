package main

import (
	"github.com/joho/godotenv"
	"gitlab.com/archstack/core-api/lib/logger"
	"gitlab.com/archstack/core-api/lib/server/http"
	"gitlab.com/archstack/inventory-api/internal/api"
	"gitlab.com/archstack/inventory-api/internal/configs"
	"go.uber.org/zap"
)

func main() {
	err := godotenv.Load(".env")

	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()

	httpConfig, err := configs.HTTP()
	apiConfig, err := configs.API()

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
