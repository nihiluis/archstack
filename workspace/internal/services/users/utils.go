package users

import (
	uuid "github.com/gofrs/uuid"
	"gitlab.com/archstack/core-api/lib/models"
)

// MapUsersToIDs turns an array of users into an array of uuids by their ids
func MapUsersToIDs(vs []models.User) []uuid.UUID {
	vsm := make([]uuid.UUID, len(vs))
	for i, v := range vs {
		vsm[i] = v.ID
	}
	return vsm
}
