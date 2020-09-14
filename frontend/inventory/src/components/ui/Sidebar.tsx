import * as React from "react"
import cx from "classnames"

import sidebarStyle from "./Sidebar.module.css"

interface Props {
  position: "right" | "left"
  className?: string
}

class Sidebar extends React.Component<Props, {}> {
  render(): JSX.Element {
    const { position, children, className } = this.props

    const asideClasses = cx(sidebarStyle.sidebar, className, {
      [sidebarStyle.sidebarRight]: position === "right",
      [sidebarStyle.sidebarLeft]: position === "left"
    })

    return (
      <aside className={asideClasses}>
        <div className={sidebarStyle.sidebarInner}>
          {children}
        </div>
      </aside>
    )
  }
}

export const SidebarTitle: React.FunctionComponent = props =>
  <h2>{props.children}</h2>

export const SidebarCategory: React.FunctionComponent = props =>
  <div>{props.children}</div>

export default Sidebar
