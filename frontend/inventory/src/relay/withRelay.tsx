import React, {
  ComponentClass,
  Component,
  ComponentType,
  ReactType,
  ReactNode,
} from "react"
import { RelayEnvironmentProvider } from "react-relay/hooks"
import { NextPageContext } from "next"
import { useEnvironment } from "./relay"
const { Suspense } = React

//import { getQueryRecordsFromEnvironment, getOperationFromQuery } from "./utils"

interface ComposedComponentProps {}

function withRelay<T extends ComposedComponentProps>(
  ComposedComponent: React.ComponentType<T>
) {
  const WithRelay = (props: T) => {
    return (
      <Suspense fallback={"Loading..."}>
        <ComposedComponent {...props} />
      </Suspense>
    )
  }

  return WithRelay
}

export default withRelay
