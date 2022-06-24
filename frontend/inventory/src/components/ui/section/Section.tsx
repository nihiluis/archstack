import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports";

export type SectionSize = "half" | "full"

interface SectionProps {
  size?: SectionSize
}

const Section: React.FC<SectionProps> = props => {
  const size = props.size || "full"
  const classes = cx(style.section, { [style.sectionHalf]: size === "half"})

  return (
    <div className={classes}>
      {props.children}
    </div>
  )
}

export default Section
