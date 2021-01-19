import React from "react"
import { cx } from "../../../lib/reexports"
import * as textareaStyle from "./Textarea.module.css"

interface Props {
  name: string
  value: string
  handleChange?: (text: string) => void
  className?: string
}

export default function Textarea(props: Props): JSX.Element {
  const { value, name, handleChange, className } = props

  return (
    <textarea
      name={name}
      className={cx(textareaStyle.input, className)}
      onChange={event => {
        if (handleChange) handleChange(event.target.value)
        event.preventDefault()
      }}
      value={value}
    />
  )
}
