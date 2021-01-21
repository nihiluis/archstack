import React from "react"
import { Section } from "../MutateDocument"
import EnumEditor from "./EnumEditor"
import NumberEditor from "./NumberEditor"
import TextEditor from "./TextEditor"
import RelationEditor from "./RelationEditor"

export interface RelationObject {
  id: string
  name: string
  parent: {
    id: string
    name: string
  }
}

interface FieldProps {
  id: string
  name: string
  fieldType: string
  fieldTypeMetadata: unknown
  relationObjects?: RelationObject[]
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
  const { fieldTypeMetadata, fieldType, id: fieldId, relationObjects } = props

  const metadata = fieldTypeMetadata

  switch (fieldType) {
    case "string":
      return <TextEditor {...props} metadata={metadata} />
    case "enum":
      return <EnumEditor {...props} metadata={metadata} fieldId={fieldId} />
    case "number":
      return <NumberEditor {...props} />
    case "relation":
      if (!relationObjects) {
        console.warn("relationObjects may not be null in RelationEditor")
        return null
      }

      return (
        <RelationEditor
          {...props}
          relationObjects={props.relationObjects!}
          metadata={metadata}
        />
      )
    default:
      return null
  }
}
