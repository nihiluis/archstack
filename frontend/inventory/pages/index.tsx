import React, { useEffect, useState, useContext } from "react"

import Auth from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"

import Layout from "../src/components/ui/Layout"
import FilterSidebar from "../src/components/sidebar/FilterSidebar"
import DocumentList from "../src/components/list/DocumentList"
import { initEnvironment } from "../src/relay/relay"

export default function Index() {
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

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}
