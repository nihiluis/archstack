export const DEV = process.env.NODE_ENV !== "production"

export const BASE_PATH = "/workspace-selection-app"

export const SITE_TITLE = "Archstack"
export const PRODUCT_NAME = "Archstack"

export const AUTH_API_URL = !DEV ? "https://auth-api.archstack.nihiluis.com" : "https://auth-api.archstack.nihiluis.com"

export const WORKSPACE_API_URL = !DEV ? "https://workspace-api.archstack.nihiluis.com" : "https://workspace-api.archstack.nihiluis.com"

export const INVENTORY_URL = !DEV ? "https://archstack.gitlab.io/inventory-app" : "http://localhost:3001"

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_LOGIN_URL = `${AUTH_API_URL}/login`
export const ENDPOINT_WORKSPACES_URL = `${WORKSPACE_API_URL}/user/workspaces`

export const ENDPOINT_INVENTORY_LOGIN_URL = `${INVENTORY_URL}/login`
