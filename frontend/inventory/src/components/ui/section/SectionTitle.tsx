import * as React from "react"

import * as style from "./section.module.css"
import { SectionSize } from "./Section"
import { cx } from "../../../lib/reexports"

interface Props {
  title: string
  size?: SectionSize
}

const SectionTitle: React.FC<Props> = props => {
  const size = props.size || "full"
  const classes = cx(style.sectionTitle, {
    [style.sectionTitleHalf]: size === "half",
  })

  return <h2 className={classes}>{props.title}</h2>
}

export default SectionTitle
