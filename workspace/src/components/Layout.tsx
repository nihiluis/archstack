import React, { PropsWithChildren } from "react"

import Head from "next/head"

import { SITE_TITLE, PRODUCT_NAME } from "../constants/env"
import * as Logo from "../../public/logo.svg"

export default function Layout(props: PropsWithChildren<{}>) {
  return (
    <div className="container mx-auto">
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>
      <header>
        <div className="mt-12 mb-8 flex">
          <Logo className="mr-4" style={{ width: 24, height: 24 }} />
          <h4>{PRODUCT_NAME}</h4>
        </div>
      </header>
      <main>{props.children}</main>
    </div>
  )
}
