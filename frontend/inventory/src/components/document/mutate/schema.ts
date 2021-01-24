import * as Yup from "yup"
import { getIdFromNodeId } from "../../../lib/hasura"
import { Fields } from "./MutateDocument"

function mapFieldsToSchema(
  fields: Fields
): { [fieldId: string]: Yup.BaseSchema } {
  return fields.reduce((map, field) => {
    const id = getIdFromNodeId(field.node.field.id)
    const mandatory = field.node.field.mandatory
    const typeString = field.node.field.field_type.type
    let schemaField: Yup.BaseSchema

    switch (typeString) {
      case "number":
        const metadata = field.node.field.field_type.metadata as any

        schemaField = Yup.number()
        if (metadata.min) {
          schemaField = (schemaField as Yup.NumberSchema).moreThan(metadata.min)
        }

        if (metadata.max) {
          schemaField = (schemaField as Yup.NumberSchema).max(metadata.max)
        }

        break
      case "string":
        schemaField = Yup.string().min(4).max(24)
        break
      case "enum":
      case "relation":
        schemaField = Yup.string()
        break
      default:
        console.warn(`found unknown type ${typeString} on field ${id}`)
        return map
    }

    if (mandatory) {
      schemaField = schemaField.required()
    }

    map[id] = schemaField

    return map
  }, {})
}

export function createSchema(fields: Fields): Yup.BaseSchema {
  const schema = Yup.object().shape({
    name: Yup.string().min(4).max(24).required(),
    external_id: Yup.string().min(4).max(24).required(),
    description: Yup.string().optional(),
    parent: Yup.string().optional(),
    ...mapFieldsToSchema(fields),
  })

  return schema
}
