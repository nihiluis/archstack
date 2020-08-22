package relationships_test

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestRelationships(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Relationships Suite")
}
