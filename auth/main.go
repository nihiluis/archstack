package main

import (
	"gitlab.com/archstack/auth-api/internal/configs"
	"gitlab.com/archstack/auth-api/internal/server/http/handlers"
	"gitlab.com/archstack/auth-api/internal/services/auth/keycloak"
	"gitlab.com/archstack/auth-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/lib/datastore"
	"gitlab.com/archstack/workspace-api/lib/logger"
	"gitlab.com/archstack/workspace-api/lib/server/http"
	"go.uber.org/zap"
)

func main() {
	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()

	keycloakConfig, err := configs.Keycloak()
	pgConfig, err := configs.Datastore()
	_, err = configs.Auth()
	httpConfig, err := configs.HTTP()

	datastore, err := datastore.NewService(pgConfig)
	if err != nil {
		panic(err)
	}
	defer datastore.DB.Close()

	keycloak, err := keycloak.NewService(logger, datastore, keycloakConfig)
	if err != nil {
		panic(err)
	}

	users, err := users.NewService(logger, datastore, keycloak)
	if err != nil {
		panic(err)
	}

	server, err := http.NewEchoService(logger, httpConfig)

	handlers, err := handlers.NewService(logger, keycloak, users)
	handlers.AddHandlers(server)

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting", zap.String("port", httpConfig.Port))
	server.Start()
}
