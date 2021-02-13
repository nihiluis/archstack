module gitlab.com/archstack/inventory-api

go 1.14

replace gitlab.com/archstack/core-api => ../core-api

replace gitlab.com/archstack/workspace-api => ../workspace-api

require (
	github.com/dghubble/sling v1.3.0
	github.com/go-playground/universal-translator v0.17.0 // indirect
	github.com/go-playground/validator v9.31.0+incompatible
	github.com/gofrs/uuid v4.0.0+incompatible
	github.com/joho/godotenv v1.3.0
	github.com/labstack/echo/v4 v4.2.0
	github.com/leodido/go-urn v1.2.0 // indirect
	github.com/segmentio/encoding v0.1.15 // indirect
	gitlab.com/archstack/core-api v0.0.0-00010101000000-000000000000
	gitlab.com/archstack/workspace-api v0.0.0-00010101000000-000000000000
	go.uber.org/zap v1.16.0
	golang.org/x/exp v0.0.0-20200821190819-94841d0725da // indirect
)
