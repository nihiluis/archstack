import { FormikProps } from "formik"
import React from "react"
import Select from "react-select"

interface Option {
  label: string
  value: string
}

interface Props {
  id: string
  value: string
  metadata: unknown
  fieldId: string
  onChange: (text: string) => void
  onBlur: () => void
}

interface EnumMetadataItem {
  id: string
  label: string
}

export default function EnumEditor(props: Props) {
  const { id, metadata, onChange, onBlur, fieldId, value } = props

  if (!Array.isArray(metadata)) {
    console.error(
      `found non array metadata on field ${fieldId}: ${JSON.stringify(
        metadata
      )}`
    )
    return null
  }

  const tmpMetadata = metadata as EnumMetadataItem[]

  const options: { [key: string]: Option } = {}

  for (let item of tmpMetadata) {
    options[item.id] = { label: item.label, value: item.id }
  }

  const nullValue = value ? { value, label: options[value].label } : null

  return (
    <Select
      name={id}
      className="w-48"
      options={Object.values(options)}
      value={nullValue}
      onBlur={onBlur}
      onChange={option => onChange(option.value)}
    />
  )
}
