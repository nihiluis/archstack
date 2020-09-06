module gitlab.com/archstack/inventory-api

go 1.14

replace gitlab.com/archstack/core-api => ../core-api

require (
	github.com/go-pg/pg/v10 v10.0.0-beta.11 // indirect
	gitlab.com/archstack/core-api v0.0.0-00010101000000-000000000000
	go.uber.org/zap v1.16.0
)
