import React from "react"

import * as styles from "./MiniSearch.module.css"

interface Props {}

export default function MiniSearch(props: Props): JSX.Element {
  return (
    <div className={styles.miniSearch}>
      <input placeholder="Search..." />
    </div>
  )
}
