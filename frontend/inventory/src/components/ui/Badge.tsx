import React from "react"
import { cx } from "../../lib/reexports"

interface Props {
  title: string
  color?: string
  className?: string
  outline?: boolean
  style?: { borderColor?: string }
  onClick?: () => void
}

export default function Badge(props: Props): JSX.Element {
  const style: any = props.style || {}

  if (props.color && !props.outline) {
    style.backgroundColor = props.color
  }

  return (
    <div
      className={cx(
        "rounded-full px-2 py-1 text-white text-sm",
        { "bg-gray-600": !props.outline },
        props.className
      )}
      onClick={props.onClick}
      style={style}>
      {props.title}
    </div>
  )
}
