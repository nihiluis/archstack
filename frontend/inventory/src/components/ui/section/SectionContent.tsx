import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports";

export type SectionSize = "half" | "full"

interface Props {
  size?: SectionSize
}

const SectionContent: React.FC<Props> = props => {
  const size = props.size || "full"
  const classes = cx(style.sectionContent, { [style.sectionHalf]: size === "half"})

  return (
    <div className={classes}>
      {props.children}
    </div>
  )
}

export default SectionContent
