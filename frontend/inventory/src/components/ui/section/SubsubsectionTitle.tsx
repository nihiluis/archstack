import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports"

interface Props {
  title: string
}

const SubsubsectionTitle: React.FC<Props> = props => {
  const classes = cx(style.subsubsectionTitle)

  return <h4 className={classes}>{props.title}</h4>
}

export default SubsubsectionTitle
