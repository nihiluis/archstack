import * as React from "react"

import NavigationItem from "./NavigationItem"

import * as InventoryIcon from "../icons/Inventory.svg"
import * as ReportsIcon from "../icons/Reports.svg"

import navStyle from "./Navigation.module.css"

const Navigation: React.FunctionComponent = () => (
  <nav>
    <div>
      <ul className={navStyle.nav}>
        <NavigationItem name="Inventory" url="/" Icon={InventoryIcon} />
        <NavigationItem
          name="Reports"
          url="/overview/user"
          className="flex"
          Icon={ReportsIcon}
        />
      </ul>
    </div>
  </nav>
)

export default Navigation
