import React, { useEffect, useState, useContext } from "react"

import Auth from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"

import Layout from "../src/components/ui/Layout"
import FilterSidebar from "../src/components/sidebar/FilterSidebar"
import DocumentList from "../src/components/list/DocumentList"

export default function Index() {
  const { workspace } = useContext(WorkspaceContext)

  return (
    <Auth require>
      <Workspace>
        <Layout
          showSidebarLeft={true}
          showSidebarRight={true}
          sidebarLeftComponent={<FilterSidebar />}
          sidebarRightComponent={null}>
          <DocumentList />
        </Layout>
      </Workspace>
    </Auth>
  )
}
