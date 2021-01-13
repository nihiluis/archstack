import React from "react"
import { Section } from "../MutateDocument"

type Field = Section["fields_connection"]["edges"][number]["node"]["field"]

interface FieldProps {
  field: Field
}

export default function Field(props: FieldProps): JSX.Element {
  const { field } = props

  return (
    <div key={`field-${field.id}`}>
      <h4>{field.name}</h4>
      
    </div>
  )
}

function FieldEditor(props: FieldProps): JSX.Element {
  const { field } = props
}
