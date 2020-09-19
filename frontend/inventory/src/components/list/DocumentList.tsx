import React from "react"

import * as RefreshSVG from "../icons/Refresh.svg"
import * as ChevronDownSVG from "../icons/ChevronDown.svg"

interface Props {}

export default function DocumentList(props: Props): JSX.Element {
  return (
    <div>
      <Menu />
    </div>
  )
}

function Menu(): JSX.Element {
  return (
    <div className="flex justify-between w-full">
      <div>
        <button className="btn btn-primary mr-2">New</button>
        <button className="btn btn-primary">Export</button>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <p className="font-semibold mr-1">Sort by</p>
          <ChevronDownSVG style={{ width: 24, height: 24 }} />
        </div>
        <RefreshSVG style={{ width: 16, height: 16 }} />
      </div>
    </div>
  )
}
