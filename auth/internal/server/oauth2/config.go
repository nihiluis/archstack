package oauth2

// Config holds all the configuration required to start the HTTP server
type Config struct {
	Host            string
	Port            string
	ClientDomainURL string
}
