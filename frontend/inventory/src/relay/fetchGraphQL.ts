import { getLocalWorkspaceId } from "../lib/workspace"
import { WORKSPACE_HEADER, ENDPOINT_RELAY_URL } from "../constants/env"

async function fetchGraphQL(text: any, variables: any) {
  const workspace = getLocalWorkspaceId()

  const response = await fetch(ENDPOINT_RELAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [WORKSPACE_HEADER]: workspace,
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  })

  return await response.json()
}

export default fetchGraphQL
