import React from "react"
import { Section } from "../MutateDocument"
import EnumEditor from "./EnumEditor"
import NumberEditor from "./NumberEditor"
import TextEditor from "./TextEditor"

interface FieldProps {
  id: string
  name: string
  fieldType: string
  fieldTypeMetadata: unknown
  value: string
  handleChange: (text: string) => void
}

export default function Field(props: FieldProps): JSX.Element {
  const { id, name } = props

  return (
    <div key={`field-${id}`} className="mb-3">
      <h4 className="mb-2">{name}</h4>
      <FieldEditor {...props} />
    </div>
  )
}

function FieldEditor(props: FieldProps): JSX.Element {
  const { fieldTypeMetadata, fieldType, id: fieldId } = props

  const metadata = fieldTypeMetadata

  switch (fieldType) {
    case "string":
      return <TextEditor {...props} metadata={metadata} />
    case "enum":
      return <EnumEditor {...props} metadata={metadata} fieldId={fieldId} />
    case "number":
      return <NumberEditor {...props} />
    default:
      return null
  }
}
