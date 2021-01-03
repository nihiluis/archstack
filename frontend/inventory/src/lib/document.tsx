import React from "react"

interface HasDocumentName {
  name: string
  parent?: HasDocumentName
}

export function getDocumentName(
  document: HasDocumentName,
  showParentName: boolean = true
): JSX.Element {
  if (!document.parent || !showParentName) {
    return <React.Fragment>{document.name}</React.Fragment>
  }

  return (
    <React.Fragment>
      <p className="text-gray-500">{document.parent.name} /</p>
      <p className="whitespace-pre">{" " + document.name}</p>
    </React.Fragment>
  )
}
