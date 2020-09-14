import React, { useEffect, useState, useContext } from "react"

import Auth from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"

import Layout from "../src/components/ui/Layout"

export default function Index() {
  const { workspace } = useContext(WorkspaceContext)

  return (
    <Layout
      showSidebarLeft={true}
      showSidebarRight={true}
      sidebarLeftComponent={null}
      sidebarRightComponent={null}>
      <Auth require>
        <Workspace>Workspace ID: {workspace.id}</Workspace>
      </Auth>
    </Layout>
  )
}
