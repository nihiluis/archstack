import React, { PropsWithChildren } from "react"

export default function ErrorText({
  text,
  touched,
}: {
  text?: string
  touched?: boolean
}): JSX.Element {
  if (!text || !touched) {
    return null
  }

  return <p className="error">{text}</p>
}
