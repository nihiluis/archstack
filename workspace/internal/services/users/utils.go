package users

import uuid "github.com/gofrs/uuid"

// MapUsersToIDs turns an array of users into an array of uuids by their ids
func MapUsersToIDs(vs []User) []uuid.UUID {
	vsm := make([]uuid.UUID, len(vs))
	for i, v := range vs {
		vsm[i] = v.ID
	}
	return vsm
}
