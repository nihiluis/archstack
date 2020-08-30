module gitlab.com/archstack/workspace-api

go 1.14

replace gitlab.com/archstack/workspace-api => ./

replace gitlab.com/archstack/core-api => ../core-api

require (
	github.com/dghubble/sling v1.3.0
	github.com/dgrijalva/jwt-go/v4 v4.0.0-preview1
	github.com/go-pg/pg v8.0.7+incompatible
	github.com/go-pg/pg/v10 v10.0.0-beta.9
	github.com/go-playground/universal-translator v0.17.0 // indirect
	github.com/go-playground/validator v9.31.0+incompatible
	github.com/gofrs/uuid v3.3.0+incompatible
	github.com/google/go-cmp v0.5.1 // indirect
	github.com/gorilla/sessions v1.2.1
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/labstack/echo v3.3.10+incompatible
	github.com/labstack/echo/v4 v4.1.17
	github.com/labstack/gommon v0.3.0 // indirect
	github.com/leodido/go-urn v1.2.0 // indirect
	github.com/onsi/ginkgo v1.14.0
	github.com/onsi/gomega v1.10.1
	github.com/stretchr/testify v1.6.1 // indirect
	gitlab.com/archstack/core-api v0.0.0-00010101000000-000000000000
	go.uber.org/zap v1.15.0
	golang.org/x/crypto v0.0.0-20200820211705-5c72a883971a
	golang.org/x/mod v0.1.1-0.20191107180719-034126e5016b // indirect
	golang.org/x/net v0.0.0-20200822124328-c89045814202 // indirect
	golang.org/x/text v0.3.3 // indirect
	golang.org/x/tools v0.0.0-20200207183749-b753a1ba74fa // indirect
	google.golang.org/protobuf v1.25.0 // indirect
	gopkg.in/check.v1 v1.0.0-20190902080502-41f04d3bba15 // indirect
	mellium.im/sasl v0.2.1 // indirect
)
