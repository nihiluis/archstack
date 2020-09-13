import React, { useEffect, useState, useContext } from "react"

import Auth from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"

import * as Logo from "../public/logo.svg"

export default function Index() {
  const { workspace } = useContext(WorkspaceContext)

  return (
    <Auth require>
      <Workspace>
        <Logo className="mr-4" style={{ width: 24, height: 24 }} />
        Workspace ID: {workspace.id}
      </Workspace>
    </Auth>
  )
}
