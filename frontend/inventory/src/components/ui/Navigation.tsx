import * as React from "react"

import NavigationItem from "./NavigationItem"

import * as InventorySVG from "../icons/Inventory.svg"
import * as ReportsSVG from "../icons/Reports.svg"

import navStyle from "./Navigation.module.css"

const Navigation: React.FunctionComponent = () => (
  <nav>
    <div>
      <ul className={navStyle.nav}>
        <NavigationItem name="Inventory" url="/" Icon={InventorySVG} />
        <NavigationItem
          name="Reports"
          url="/overview/user"
          className="flex"
          Icon={ReportsSVG}
        />
      </ul>
    </div>
  </nav>
)

export default Navigation
