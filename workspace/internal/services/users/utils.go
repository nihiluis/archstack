package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/workspace-api/lib/models"
	"golang.org/x/crypto/bcrypt"
)

// MapUsersToIDs turns an array of users into an array of uuids by their ids
func MapUsersToIDs(vs []models.User) []uuid.UUID {
	vsm := make([]uuid.UUID, len(vs))
	for i, v := range vs {
		vsm[i] = v.ID
	}
	return vsm
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
