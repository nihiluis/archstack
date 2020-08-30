import React, { PropsWithChildren } from "react"

import Head from "next/head"

interface AuthResult

async function checkAuth() {

}

export default function Layout(props: PropsWithChildren<{}>) {
  return (
    <React.Fragment>
      <Head>
        <title>Authenticating...</title>
      </Head>
      {props.children}
    </React.Fragment>
  )
}
