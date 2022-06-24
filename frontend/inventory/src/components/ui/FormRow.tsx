import React, { PropsWithChildren } from "react"

export default function FormRow(props: PropsWithChildren<{ label: string }>) {
  return (
    <div className="mb-2">
      <label className="ml-1 mb-1 block">{props.label}</label>
      {props.children}
    </div>
  )
}
