import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports";

interface Props {
}

const SectionButtonBar: React.FC<Props> = props => {
  const classes = cx(style.sectionButtonBar)

  return (
    <div className={classes}>
      {props.children}
    </div>
  )
}

export default SectionButtonBar
