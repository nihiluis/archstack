import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports"

export type SectionSize = "half" | "full"

interface Props {
  size?: SectionSize
  className?: string
}

const SubsectionContent: React.FC<Props> = props => {
  const size = props.size || "full"
  const classes = cx(style.subsectionContent, props.className, {
    [style.sectionHalf]: size === "half",
  })

  return <div className={classes}>{props.children}</div>
}

export default SubsectionContent
