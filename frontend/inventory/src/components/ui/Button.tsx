import React, { PropsWithChildren } from "react"
import { cx } from "../../lib/reexports"

export interface Props {
  onClick?: () => void
  name: string
  className?: string
  type?: "submit" | "reset" | "button"
}

export default function Button(props: PropsWithChildren<Props & any>): JSX.Element {
  const { children, name, onClick, className, ...rest } = props

  const classes = cx(className, "btn")

  return (
    <button
      {...rest}
      name={`btn-${name}`}
      className={classes}
      onClick={onClick}>
      {children}
    </button>
  )
}
