package datastore

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

// Config struct holds all the configurations required the datastore package
type Config struct {
	Host   string `json:"host,omitempty"`
	Port   string `json:"port,omitempty"`
	Driver string `json:"driver,omitempty"`

	StoreName string `json:"storeName,omitempty"`
	Username  string `json:"username,omitempty"`
	Password  string `json:"password,omitempty"`

	SSLMode string `json:"sslMode,omitempty"`

	ConnPoolSize uint          `json:"connPoolSize,omitempty"`
	ReadTimeout  time.Duration `json:"readTimeout,omitempty"`
	WriteTimeout time.Duration `json:"writeTimeout,omitempty"`
	IdleTimeout  time.Duration `json:"idleTimeout,omitempty"`
	DialTimeout  time.Duration `json:"dialTimeout,omitempty"`
}

// ConnURL returns the connection URL
func (cfg *Config) ConnURL() string {
	sslMode := strings.TrimSpace(cfg.SSLMode)
	if sslMode == "" {
		sslMode = "disable"
	}

	return fmt.Sprintf(
		"%s://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.Driver,
		cfg.Username,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.StoreName,
		sslMode,
	)
}

type Datastore struct {
	DB *pg.DB
}

// NewService returns a new instance of PG
func NewService(cfg *Config) (*Datastore, error) {
	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		databaseURL = cfg.ConnURL()
	}

	opt, err := pg.ParseURL(databaseURL)
	if err != nil {
		return nil, err
	}

	db := pg.Connect(opt)

	datastore := Datastore{db}

	return &datastore, nil
}

func (datastore *Datastore) CreateSchema(models []interface{}) error {
	for _, model := range models {
		err := datastore.DB.Model(model).CreateTable(&orm.CreateTableOptions{IfNotExists: true})
		if err != nil {
			return err
		}
	}
	return nil
}
