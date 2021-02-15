import React, { useContext, useState, useEffect } from "react"
import dynamic from "next/dynamic"

import Auth, { AuthContext } from "../src/components/Auth"
import Workspace, { WorkspaceContext } from "../src/components/Workspace"
import { useRouter } from "next/router"
import { LOGIN_URL } from "../src/constants/env"

function Login() {
  const router = useRouter()

  // maybe the token should NOT be retrieved from query here
  const { workspaceId, token } = router.query

  if (
    router.asPath.indexOf("workspaceId") === -1 ||
    router.asPath.indexOf("token") === -1
  ) {
    console.log("redirecting to auth")
    if (window) {
      window.location.href = LOGIN_URL
    }
  }

  useEffect(() => {
    if (workspaceId && token) {
      if (typeof workspaceId !== "string" || typeof token !== "string") {
        console.log("redirecting to auth")
        window.location.href = LOGIN_URL
      }
    }
  })

  if (!workspaceId || !token) {
    return null
  }

  return (
    <Auth require={false} initialToken={token as string}>
      <Workspace require={false} workspaceId={workspaceId as string} />
    </Auth>
  )
}

export default dynamic(() => Promise.resolve(Login), { ssr: false })
