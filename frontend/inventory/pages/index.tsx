import React, { useEffect, useState, useContext } from "react"

import Auth from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"

import Layout from "../src/components/ui/Layout"
import FilterSidebar from "../src/components/sidebar/FilterSidebar"

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
          Workspace ID: {workspace.id}
        </Layout>
      </Workspace>
    </Auth>
  )
}
