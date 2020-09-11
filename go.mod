module gitlab.com/archstack/inventory-api

go 1.14

replace gitlab.com/archstack/core-api => ../core-api

require (
	github.com/dghubble/sling v1.3.0
	github.com/go-pg/pg/v10 v10.0.0-beta.11 // indirect
	github.com/go-playground/universal-translator v0.17.0 // indirect
	github.com/go-playground/validator v9.31.0+incompatible
	github.com/gofrs/uuid v3.3.0+incompatible
	github.com/labstack/echo/v4 v4.1.17
	github.com/leodido/go-urn v1.2.0 // indirect
	gitlab.com/archstack/core-api v0.0.0-00010101000000-000000000000
	go.uber.org/zap v1.16.0
)
