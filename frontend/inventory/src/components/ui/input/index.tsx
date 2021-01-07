import React from "react"
import { cx } from "../../../lib/reexports"
import * as inputStyle from "./Input.module.css"

interface Props {
  type: string
  name: string
  value: string
  handleChange?: (text: string) => void
  className?: string
}

export default function Input(props: Props): JSX.Element {
  const { value, type, name, handleChange, className } = props

  return (
    <input
      type={type}
      name={name}
      className={cx(inputStyle.input, className)}
      onChange={event => {
        if (handleChange) handleChange(event.target.value)
        event.preventDefault()
      }}
      value={value}
    />
  )
}
