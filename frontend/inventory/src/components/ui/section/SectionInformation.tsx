import * as React from "react"

import * as style from "./section.module.css"
import { cx } from "../../../lib/reexports"

interface SectionInformationItem {
  name: string
  value: string
}

interface Props {
  items: SectionInformationItem[]
  className?: string
  itemClassName?: string
}

const SectionInformation: React.FC<Props> = props => {
  const classes = cx(style.sectionInformationContainer, props.className)
  const itemClasses = cx(style.sectionInformationItem, props.itemClassName)

  return (
    <ul className={classes}>
      {props.items.map(({ name, value }) => (
        <React.Fragment key={`si-${name}-fragment`}>
          <li
            key={`si-${name}-name`}
            className={style.sectionInformationItemName}>
            <p>{name}</p>
          </li>
          <li
            key={`si-${name}-value`}
            className={style.sectionInformationItemValue}>
            <p>{value || "-"}</p>
          </li>
        </React.Fragment>
      ))}
    </ul>
  )
}

export default SectionInformation
