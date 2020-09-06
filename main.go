package main

import (
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/logger"
	"gitlab.com/archstack/core-api/lib/models"
	"gitlab.com/archstack/inventory-api/internal/configs"
)

func main() {
	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()

	pgConfig, err := configs.Datastore()

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

	logger.Zap.Info("Loaded all services")
}
