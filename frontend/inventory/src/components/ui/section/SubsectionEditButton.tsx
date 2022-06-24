import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports"
import Button from "../Button"

interface Props {
  editting: boolean
  name: string
  toggleEditting: () => void
}

const SubsectionEditButton: React.FC<Props> = props => {
  const classes = cx(style.subsectionEditButton)
  const { editting, name, toggleEditting } = props

  return (
    <div className={classes}>
      {!editting && (
        <Button type="button" name={name} onClick={toggleEditting}>
          Edit
        </Button>
      )}
    </div>
  )
}

export default SubsectionEditButton
