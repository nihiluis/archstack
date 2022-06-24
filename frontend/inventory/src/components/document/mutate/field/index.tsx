import React from "react"
import { Section, FormValues } from ".."
import EnumEditor from "./EnumEditor"
import NumberEditor from "./NumberEditor"
import TextEditor from "./TextEditor"
import RelationEditor from "./RelationEditor"
import ErrorText from "../../../error/ErrorText"
import { FormikProps } from "formik"

export interface RelationObject {
  id: string
  name: string
  parent: {
    id: string
    name: string
  }
}

interface Props {
  id: string
  name: string
  fieldType: string
  fieldTypeMetadata: unknown
  relationObjects?: RelationObject[]
  formikProps: FormikProps<FormValues>
}

interface FieldProps {
  id: string
  name: string
  fieldType: string
  fieldTypeMetadata: unknown
  relationObjects?: RelationObject[]
  error: any
  touched: any
  value: string
  handleBlur: (fieldId: string) => void
  handleChange: (fieldId: string, value: any) => void
}

export default function FieldWrapper(props: Props): JSX.Element {
  const {
    id,
    name,
    fieldType,
    formikProps,
    fieldTypeMetadata,
    relationObjects,
  } = props

  return (
    <Field
      id={id}
      name={name}
      fieldType={fieldType}
      fieldTypeMetadata={fieldTypeMetadata}
      relationObjects={relationObjects}
      error={formikProps.errors[id]}
      touched={formikProps.touched[id]}
      value={formikProps.values[id]}
      handleChange={formikProps.setFieldValue}
      handleBlur={formikProps.setFieldTouched}
    />
  )
}

export function Field(props: FieldProps): JSX.Element {
  const { id, name, error, touched } = props

  return (
    <div key={`field-${id}`} className="mb-3">
      <h4 className="mb-2">{name}</h4>
      <FieldEditor {...props} />
      <ErrorText text={error} touched={touched} />
    </div>
  )
}

function FieldEditor(props: FieldProps): JSX.Element {
  const {
    fieldTypeMetadata,
    fieldType,
    id,
    relationObjects,
    handleBlur,
    handleChange,
  } = props

  const metadata = fieldTypeMetadata

  switch (fieldType) {
    case "string":
      return (
        <TextEditor
          {...props}
          metadata={metadata}
          onBlur={() => handleBlur(id)}
          onChange={value => handleChange(id, value)}
        />
      )
    case "enum":
      return (
        <EnumEditor
          {...props}
          metadata={metadata}
          fieldId={id}
          onBlur={() => handleBlur(id)}
          onChange={value => handleChange(id, value)}
        />
      )
    case "number":
      return (
        <NumberEditor
          {...props}
          onBlur={() => handleBlur(id)}
          onChange={value => handleChange(id, value)}
        />
      )
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
          onBlur={() => handleBlur(id)}
          onChange={value => handleChange(id, value)}
        />
      )
    default:
      return null
  }
}
