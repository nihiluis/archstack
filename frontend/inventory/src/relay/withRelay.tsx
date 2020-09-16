import React from "react"
import RelayEnvironment from "./RelayEnvironment"
import {
  RelayEnvironmentProvider,
  preloadQuery,
  usePreloadedQuery,
} from "react-relay/hooks"
import { NextPageContext } from "next"
const { Suspense } = React

//import { getQueryRecordsFromEnvironment, getOperationFromQuery } from "./utils"

export default (ComposedComponent, options = {}) => {
  return class WithRelay extends React.Component {
    static displayName = `WithRelay(${
      ComposedComponent.displayName || "ComposedComponent"
    })`

    static async getInitialProps(ctx: NextPageContext) {
      let composedInitialProps = {}

      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx)
      }

      /*
      let queryProps = {}
      let queryRecords = {}
      let operationToRetain

      if (options.query) {
        queryProps = await fetchQuery(
          environment,
          options.query,
          options.variables || {}
        )
        queryRecords = getQueryRecordsFromEnvironment(environment)
        operationToRetain = getOperationFromQuery(
          options.query,
          options.variables
        )
      }
      */

      return {
        ...composedInitialProps,
        // ...queryProps,
        // queryRecords,
        // operationToRetain,
      }
    }

    constructor(props) {
      super(props)
      this.environment = initEnvironment({
        records: props.queryRecords,
      })
    }

    render() {
      return (
        <RelayEnvironmentProvider environment={RelayEnvironment}>
          <Suspense fallback={"Loading..."}>
            <ComposedComponent {...this.props} />
          </Suspense>
        </RelayEnvironmentProvider>
      )
    }
  }
}
