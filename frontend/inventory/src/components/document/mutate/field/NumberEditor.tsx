import { FormikProps } from "formik"
import React from "react"
import Input from "../../../ui/input"

interface Props {
  id: string
  value?: string
  handleChange: (text: string) => void
}

export default function NumberEditor(props: Props) {
  return (
    <Input
      type="number"
      name={props.id}
      value={props.value}
      handleChange={props.handleChange}
    />
  )
}
