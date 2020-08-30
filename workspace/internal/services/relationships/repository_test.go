package relationships_test

import (
	"github.com/go-pg/pg/v10"
	uuid "github.com/gofrs/uuid"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"gitlab.com/archstack/workspace-api/internal/configs"
	"gitlab.com/archstack/workspace-api/internal/services/relationships"
	"gitlab.com/archstack/core-api/lib/datastore"
	"gitlab.com/archstack/core-api/lib/models"
)

var _ = Describe("Repository", func() {
	var (
		db            *pg.DB
		tx            *pg.Tx
		user          *models.User
		workspace     *models.Workspace
		workspaceUser *relationships.WorkspaceAndUser
		err           error
	)

	BeforeEach(func() {
		configs, err := configs.NewTestService()
		Expect(err).To(BeNil())

		datastoreConfig, _ := configs.Datastore()

		store, err := datastore.NewService(datastoreConfig)
		Expect(err).To(BeNil())

		workspaceID, err := uuid.NewV4()
		if err != nil {
			Expect(err).To(BeNil())
		}
		workspace = &models.Workspace{ID: workspaceID, Name: "test"}

		userID, err := uuid.NewV4()
		if err != nil {
			Expect(err).To(BeNil())
		}
		user = &models.User{
			ID:        userID,
			FirstName: "Rolf",
			LastName:  "Rolf",
			Password:  "Test",
			Mail:      "test@test.com",
		}

		tmpWorkspaceUser := relationships.NewWorkspaceAndUser(workspace, user)
		workspaceUser = &tmpWorkspaceUser

		db = store.DB
		//db.AddQueryHook(datastore.DBLoggerHook{})

		tx, err = db.Begin()
		Expect(err).To(BeNil())
	})

	Describe("AddRelation", func() {
		Context("with no records in the database", func() {
			BeforeEach(func() {
				_, err = tx.Model(workspace).Insert()
				Expect(err).To(BeNil())

				var workspaces []models.Workspace
				err = tx.Model(&workspaces).Select()
				Expect(err).To(BeNil())
				Expect(len(workspaces)).To(Equal(1))

				_, err = tx.Model(user).Insert()
				Expect(err).To(BeNil())

				var users []models.User
				err = tx.Model(&users).Select()
				Expect(err).To(BeNil())
				Expect(len(users)).To(Equal(1))

				_, err = tx.Model(workspaceUser).Insert()
				Expect(err).To(BeNil())

				var workspaceUsers []relationships.WorkspaceAndUser
				err = tx.Model(&workspaceUsers).Select()
				Expect(err).To(BeNil())
				Expect(len(workspaceUsers)).To(Equal(1))
			})

			It("return workspace with users from db", func() {
				tmpWorkspace := new(models.Workspace)

				err := tx.Model(tmpWorkspace).
					Relation("Users").
					Where("workspace.id = ?", workspace.ID).
					First()

				Expect(err).To(BeNil())
				Expect(len(tmpWorkspace.Users)).To(Equal(1))
			})
		})
	})

	AfterEach(func() {
		err = tx.Rollback()
		Expect(err).To(BeNil())
	})
})
