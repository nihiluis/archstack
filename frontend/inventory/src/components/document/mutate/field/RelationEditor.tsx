import React from "react"
import Select from "react-select"
import { RelationObject } from "."
import { getDocumentName, HasDocumentName } from "../../../../lib/document"

interface Option {
  label: string
  value: string
  documentData: HasDocumentName
}

interface Props {
  id: string
  value: string
  metadata: unknown
  relationObjects: RelationObject[]
  onChange: (text: string) => void
  onBlur: () => void
}

interface EnumMetadataItem {
  id: string
  label: string
}

function formatOptionLabel({
  value,
  label,
  documentData,
}: Option): JSX.Element {
  return getDocumentName(documentData)
}

export default function RelationEditor(props: Props) {
  const { id, relationObjects, onChange, onBlur, value } = props

  const options: { [key: string]: Option } = {}

  for (let item of relationObjects) {
    options[item.id] = { label: item.name, value: item.id, documentData: item }
  }

  const nullValue = value
    ? {
        value,
        label: options[value].label,
        documentData: options[value].documentData,
      }
    : null

  return (
    <Select<Option>
      name={id}
      className="w-48"
      formatOptionLabel={formatOptionLabel}
      options={Object.values(options)}
      value={nullValue}
      onBlur={onBlur}
      onChange={option => onChange(option.value)}
    />
  )
}
