import React, { useEffect, useState, useContext, Suspense } from "react"

import Auth from "../../src/components/Auth"
import Workspace, { WorkspaceContext } from "../../src/components/Workspace"

import Layout from "../../src/components/ui/Layout"
import { useRouter } from "next/router"
import Document from "../../src/components/document/Document"
import RightSidebar from "../../src/components/sidebar/RightSidebar"
import DocumentSidebarWrapper from "../../src/components/sidebar/DocumentSidebar"

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
          sidebarLeftComponent={
            <DocumentSidebarWrapper documentId={id as string} />
          }
          sidebarRightComponent={<RightSidebar />}>
          <Suspense fallback="Loading...">
            <Document documentId={id as string} />
          </Suspense>
        </Layout>
      </Workspace>
    </Auth>
  )
}
