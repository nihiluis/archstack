import React, { useEffect, useState, useContext, Suspense } from "react"

import Auth from "../../src/components/Auth"
import Workspace, { WorkspaceContext } from "../../src/components/Workspace"

import Layout from "../../src/components/ui/Layout"
import { useRouter } from "next/router"
import RightSidebar from "../../src/components/sidebar/RightSidebar"
import MutateDocument from "../../src/components/document/mutate"

export default function NewDocument() {
  const { workspace } = useContext(WorkspaceContext)

  const router = useRouter()

  return (
    <Auth require>
      <Workspace>
        <Layout
          showSidebarLeft={false}
          showSidebarRight={true}
          sidebarLeftComponent={null}
          sidebarRightComponent={<RightSidebar />}>
          <Suspense fallback="Loading...">
            <MutateDocument />
          </Suspense>
        </Layout>
      </Workspace>
    </Auth>
  )
}
