import React from "react"

import Head from "next/head"

import Auth from "../src/components/Auth"
import { SITE_TITLE } from "../src/constants/env"
import * as Logo from "../public/logo.svg"

export default function Home() {
  return (
    <Auth require>
      <Logo style={{ width: 24, height: 24 }} />
    </Auth>
  )
}
