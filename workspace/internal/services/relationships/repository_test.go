package relationships_test

import (
	"github.com/go-pg/pg"
	uuid "github.com/gofrs/uuid"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"gitlab.com/archstack/workspace-api/internal/configs"
	"gitlab.com/archstack/workspace-api/internal/platform/datastore"
	"gitlab.com/archstack/workspace-api/internal/services/relationships"
	"gitlab.com/archstack/workspace-api/internal/services/users"
	"gitlab.com/archstack/workspace-api/internal/services/workspaces"
)

var _ = Describe("Repository", func() {
	var (
		db            *pg.DB
		tx            *pg.Tx
		user          *users.User
		workspace     *workspaces.Workspace
		workspaceUser *relationships.WorkspaceAndUser
		err           error
	)

	BeforeEach(func() {
		configs, err := configs.NewTestService()
		Expect(err).To(BeNil())

		datastoreConfig, _ := configs.Datastore()

		datastore, err := datastore.NewService(datastoreConfig)
		Expect(err).To(BeNil())

		workspaceID, err := uuid.NewV4()
		workspace = &workspaces.Workspace{ID: workspaceID, Name: "test"}

		userID, err := uuid.NewV4()
		user = &users.User{
			ID:        userID,
			FirstName: "Rolf",
			LastName:  "Rolf",
			Mail:      "test@test.com",
		}

		tmpWorkspaceUser := relationships.NewWorkspaceAndUser(workspace, user)
		workspaceUser = &tmpWorkspaceUser

		db = datastore.DB

		tx, err = db.Begin()
		Expect(err).To(BeNil())
	})

	Describe("AddRelation", func() {
		Context("with no records in the database", func() {
			BeforeEach(func() {
				err = tx.Insert(workspace)
				Expect(err).To(BeNil())

				var workspaces []workspaces.Workspace
				err = tx.Model(&workspaces).Select()
				Expect(err).To(BeNil())

				err = tx.Insert(user)
				Expect(err).To(BeNil())

				err = tx.Insert(workspaceUser)
				Expect(err).To(BeNil())
			})

			It("return workspace with users from db", func() {
				var tmpWorkspace workspaces.Workspace
				err := db.Model(&tmpWorkspace).Column("workspace.*").Relation("").Where("id = ?", workspace.ID).First()
				Expect(err).To(BeNil())
				Expect(len(tmpWorkspace.Users)).To(Equal(0))
			})
		})
	})

	AfterEach(func() {
		err = tx.Rollback()
		Expect(err).To(BeNil())
	})
})
