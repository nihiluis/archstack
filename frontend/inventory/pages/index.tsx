import React, { useEffect, useState, useContext } from "react"

import Auth from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"

import Layout from "../src/components/ui/Layout"
import FilterSidebar from "../src/components/sidebar/FilterSidebar"
import DocumentList from "../src/components/list/DocumentList"
import { initEnvironment } from "../src/relay/relay"
import RightSidebar from "../src/components/sidebar/RightSidebar"

export default function Index() {
  return (
    <Auth require>
      <Workspace>
        <IndexInner />
      </Workspace>
    </Auth>
  )
}

export interface TypeFilters {
  [key: string]: boolean
}

function IndexInner() {
  const [typeFilters, setTypeFilters] = useState<TypeFilters>({})
  const [fieldFilters, setFieldFilters] = useState([])

  return (
    <Layout
      showSidebarLeft={true}
      showSidebarRight={true}
      sidebarLeftComponent={
        <FilterSidebar
          typeFilters={typeFilters}
          setTypeFilters={setTypeFilters}
        />
      }
      sidebarRightComponent={<RightSidebar />}>
      <DocumentList />
    </Layout>
  )
}

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}
