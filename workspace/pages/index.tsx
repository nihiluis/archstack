import React from "react"

import Head from "next/head"
import { SITE_TITLE } from "../src/constants/env"
import * as Logo from "../public/logo.svg"

export default function Home() {
  return (
    <div className="container mx-auto">
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>
      <header>
        <div className="mt-12 table mx-auto">
          <Logo style={{ width: 24, height: 24 }} />
          <p>Initializing.</p>
        </div>
      </header>
      <main></main>
    </div>
  )
}
