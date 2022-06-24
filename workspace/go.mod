module gitlab.com/archstack/workspace-api

go 1.14

replace gitlab.com/archstack/workspace-api => ./

replace gitlab.com/archstack/core-api => ../core-api

require (
	github.com/go-pg/pg/v10 v10.7.6
	github.com/go-playground/universal-translator v0.17.0 // indirect
	github.com/go-playground/validator v9.31.0+incompatible
	github.com/gofrs/uuid v4.0.0+incompatible
	github.com/joho/godotenv v1.3.0
	github.com/labstack/echo/v4 v4.2.0
	github.com/leodido/go-urn v1.2.0 // indirect
	gitlab.com/archstack/core-api v0.0.0-00010101000000-000000000000
	go.uber.org/zap v1.16.0
	golang.org/x/mod v0.1.1-0.20191107180719-034126e5016b // indirect
	golang.org/x/tools v0.0.0-20200207183749-b753a1ba74fa // indirect
	gopkg.in/go-playground/assert.v1 v1.2.1 // indirect
)
