import React from "react"
import { cx } from "../../lib/reexports"

interface Props {
  title: string
  color?: string
  className?: string
}

export default function Badge(props: Props): JSX.Element {
  const style: any = {}

  if (props.color) {
    style.backgroundColor = props.color
  }

  return (
    <div
      className={cx("rounded-full px-2 py-1 bg-gray-600 text-white text-sm w-3/4", props.className)}
      style={style}>
      {props.title}
    </div>
  )
}
