export const DEV = process.env.NODE_ENV !== "production"

export const IS_SERVER = typeof window === "undefined"

export const BASE_PATH = "/app"

export const SITE_TITLE = "IT repo"
export const PRODUCT_NAME = "IT repo"

export const AUTH_API_URL = !DEV ? "https://auth-api.archstack.nihiluis.com" : "https://auth-api.archstack.nihiluis.com"

export const WORKSPACE_API_URL = !DEV ? "https://workspace-api.archstack.nihiluis.com" : "https://workspace-api.archstack.nihiluis.com"

export const INVENTORY_API_URL = !DEV ? "https://inventory-api.archstack.nihiluis.com" : "https://inventory-api.archstack.nihiluis.com"

export const LOGIN_URL = !DEV ? "https://archstack.gitlab.io/workspace-selection-app" : "http://localhost:3000/login"
export const WORKSPACE_SELECTION_URL = !DEV ? "https://archstack.gitlab.io/workspace-selection-app" : "http://localhost:3000"

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_LOGIN_URL = `${AUTH_API_URL}/login`
export const ENDPOINT_GET_WORKSPACE_URL = `${WORKSPACE_API_URL}/get`

export const ENDPOINT_RELAY_URL = `${INVENTORY_API_URL}/v1/relay`

export const WORKSPACE_HEADER = "Archstack-Workspace"
