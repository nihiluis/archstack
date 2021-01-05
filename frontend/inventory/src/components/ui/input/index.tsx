import React from "react"
import * as inputStyle from "./Input.module.css"

interface Props {
  type: string
  name: string
  value: string
  handleChange: (text: string) => void
}

export default function Input(props: Props): JSX.Element {
  const { value, type, name, handleChange } = props

  return (
    <input
      type={type}
      name={name}
      className={inputStyle.input}
      onChange={event => {
        handleChange(event.target.value)
        event.preventDefault()
      }}
      value={value}
    />
  )
}
