import React from "react"
import Input from "../../../ui/input"
import Textarea from "../../../ui/textarea"

interface Props {
  id: string
  value: string
  handleChange: (text: string) => void
  metadata?: unknown
}

interface Metadata {
  maxLength?: number
}

export default function TextEditor(props: Props) {
  const { id, value, handleChange, metadata } = props

  if (metadata && typeof metadata !== "object") {
    console.error(
      `Illegal metadata is provided. The metadata on field ${id} of type string must be an object.`
    )
    return null
  }

  const tmpMetadata: Metadata | null = metadata

  const isTextArea = (tmpMetadata?.maxLength ?? 0) > 28

  return isTextArea ? (
    <Textarea className="w-128 h-32" name={id} value={value} handleChange={handleChange} />
  ) : (
    <Input type="text" name={id} value={value} handleChange={handleChange} />
  )
}
