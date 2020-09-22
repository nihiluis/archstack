import React from "react"

interface Props {
  height?: number
}

export default function Line({ height = 1 }: Props): JSX.Element {
  return <div className="w-full bg-gray-300" style={{ height }}></div>
}
