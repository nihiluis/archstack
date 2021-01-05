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
  const [focusedType, setFocusedType] = useState<{}>()
  const [fieldFilters, setFieldFilters] = useState([])
  const [nameFilter, setNameFilter] = useState<string>("")
  const [descriptionFilter, setDescriptionFilter] = useState<string>("")
  const [parentNameFilter, setParentNameFilter] = useState<string>("")

  // grab all fields for specified focusedType
  // render these fields in sidebar
  // 

  return (
    <Layout
      showSidebarLeft={true}
      showSidebarRight={true}
      sidebarLeftComponent={
        <FilterSidebar
          typeFilters={typeFilters}
          setTypeFilters={setTypeFilters}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          parentNameFilter={parentNameFilter}
          setParentNameFilter={setParentNameFilter}
          descriptionFilter={descriptionFilter}
          setDescriptionFilter={setDescriptionFilter}
        />
      }
      sidebarRightComponent={<RightSidebar />}>
      <DocumentList
        typeFilters={typeFilters}
        nameFilter={nameFilter}
        parentNameFilter={parentNameFilter}
        descriptionFilter={descriptionFilter}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  initEnvironment()

  return { props: {} }
}
