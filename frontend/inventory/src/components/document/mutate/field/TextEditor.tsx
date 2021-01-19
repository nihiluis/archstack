import React from "react"
import Input from "../../../ui/input"
import Textarea from "../../../ui/textarea"

interface Props {
  name: string
  value: string
  handleChange: (text: string) => void
  metadata?: unknown
}

interface Metadata {
  maxLength?: number
}

export default function TextEditor(props: Props) {
  const { name, value, handleChange, metadata } = props

  if (metadata && typeof metadata !== "object") {
    console.error(
      `Illegal metadata is provided. The metadata on field ${name} of type string must be an object.`
    )
    return null
  }

  const tmpMetadata: Metadata | null = metadata

  const isTextArea = (tmpMetadata?.maxLength ?? 0) > 28

  return isTextArea ? (
    <Textarea name={name} value={value} handleChange={handleChange} />
  ) : (
    <Input type="text" name={name} value={value} handleChange={handleChange} />
  )
}
