import { FormikProps } from "formik"
import React from "react"
import Input from "../../../ui/input"

interface Props {
  name: string
  value?: string
  handleChange: (text: string) => void
}

export default function NumberEditor(props: Props) {
  return (
    <Input
      type="number"
      name={props.name}
      value={props.value}
      handleChange={props.handleChange}
    />
  )
}
