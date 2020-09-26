import React, { useEffect, useState, useContext, Suspense } from "react"

import Auth from "../../src/components/Auth"
import Workspace, { WorkspaceContext } from "../../src/components/Workspace"

import Layout from "../../src/components/ui/Layout"
import { useRouter } from "next/router"
import Document from "../../src/components/document/Document"

export default function Index() {
  const { workspace } = useContext(WorkspaceContext)

  const router = useRouter()

  const { id } = router.query

  return (
    <Auth require>
      <Workspace>
        <Layout
          showSidebarLeft={true}
          showSidebarRight={true}
          sidebarLeftComponent={null}
          sidebarRightComponent={null}>
          <Suspense fallback="Loading...">
            <Document documentId={id as string} />
          </Suspense>
        </Layout>
      </Workspace>
    </Auth>
  )
}
