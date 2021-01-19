import React from "react"
import { Section } from "../MutateDocument"
import EnumEditor from "./EnumEditor"
import NumberEditor from "./NumberEditor"
import TextEditor from "./TextEditor"

type Field = Section["fields_connection"]["edges"][number]["node"]["field"]

interface FieldProps {
  field: Field
  name: string
  value: string
  handleChange: (text: string) => void
}

export default function Field(props: FieldProps): JSX.Element {
  const { field } = props

  return (
    <div key={`field-${field.id}`}>
      <h4>{field.name}</h4>
      <FieldEditor {...props} />
    </div>
  )
}

function FieldEditor(props: FieldProps): JSX.Element {
  const { field } = props
  
  const metadata = field.field_type.metadata

  switch (field.field_type.type) {
    case "string":
      return <TextEditor {...props} metadata={metadata} />
    case "enum":

      return <EnumEditor {...props} metadata={metadata} fieldId={field.id} />
    case "number":
      return <NumberEditor {...props} />
    default:
      return null
  }
}
