import { FormikProps } from "formik"
import React from "react"
import Input from "../../../ui/input"

interface Props {
  id: string
  value?: string
  onChange: (text: string) => void
  onBlur: () => void
}

export default function NumberEditor(props: Props) {
  return (
    <Input
      type="number"
      name={props.id}
      value={props.value}
      onChange={props.onChange}
      onBlur={() => {
        props.onBlur()
      }}
    />
  )
}
