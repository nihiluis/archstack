import * as React from "react"
import cx from "classnames"
import Head from "next/head"

import Navigation from "./Navigation"
import Sidebar from "./Sidebar"

import layoutStyle from "./Layout.module.css"
import Logo from "./Logo"

import * as BellSVG from "../icons/Bell.svg"
import * as ProfileSVG from "../icons/Profile.svg"
import * as SettingsSVG from "../icons/Settings.svg"

import { PRODUCT_NAME } from "../../constants/env"
import MiniSearch from "../search/MiniSearch"

interface Props {
  showSidebarLeft: boolean
  showSidebarRight: boolean
  sidebarLeftComponent: JSX.Element
  sidebarRightComponent: JSX.Element
}

export default function Layout(props: React.PropsWithChildren<Props>) {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <div
        id={layoutStyle.layout}
        className={cx({
          [layoutStyle.leftSidebar]: props.showSidebarLeft,
          [layoutStyle.rightSidebar]: props.showSidebarRight,
          [layoutStyle.noSidebar]:
            !props.showSidebarLeft && !props.showSidebarRight,
        })}>
        <header className={layoutStyle.headerGrid}>
          <div className={layoutStyle.logoHeader}>
            <Logo style={{ width: 36, height: 36 }} />
            <p className="font-semibold" style={{ lineHeight: "24px" }}>
              {PRODUCT_NAME}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Navigation />
            <div className="flex items-center">
              <MiniSearch />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ProfileSVG
                className="ml-4 text-gray-600 fill-current"
                style={{ width: 24, height: 24 }}
              />
              <BellSVG
                className="ml-2 text-gray-600 fill-current"
                style={{ width: 24, height: 24 }}
              />
            </div>
            <SettingsSVG
              className="ml-2 mr-8 text-gray-600 fill-current"
              style={{ width: 24, height: 24 }}
            />
          </div>
        </header>
        <Sidebar
          position="left"
          className={cx(layoutStyle.sidebarLeftGrid, {
            [layoutStyle.sidebarGridDisabled]: !props.showSidebarLeft,
          })}>
          {props.sidebarLeftComponent}
        </Sidebar>
        <main className={cx(layoutStyle.contentGrid)}>
          <div className={layoutStyle.content}>{props.children}</div>
        </main>
        <Sidebar
          position="right"
          className={cx(layoutStyle.sidebarRightGrid, {
            [layoutStyle.sidebarGridDisabled]: !props.showSidebarRight,
          })}>
          {props.sidebarRightComponent}
        </Sidebar>
      </div>
    </div>
  )
}
