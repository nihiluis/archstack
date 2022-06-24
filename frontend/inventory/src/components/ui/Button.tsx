import React, { PropsWithChildren } from "react"
import { cx } from "../../lib/reexports"

export interface Props {
  onClick?: () => void
  name: string
  className?: string
  type?: "submit" | "reset" | "button"
  primary?: boolean
  secondary?: boolean
  disabled?: boolean
}

export default function Button(
  props: PropsWithChildren<Props & any>
): JSX.Element {
  const {
    children,
    name,
    onClick,
    className,
    type = "button",
    secondary,
    primary = !secondary,
    disabled,
    ...rest
  } = props

  const classes = cx(className, "btn", {
    "btn-primary": primary,
    "btn-secondary": secondary,
    "btn-disabled": disabled,
  })

  return (
    <button
      {...rest}
      type={type}
      name={`btn-${name}`}
      className={classes}
      onClick={onClick}>
      {children}
    </button>
  )
}
