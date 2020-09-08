export const DEV = process.env.NODE_ENV !== "production"

export const BASE_PATH = "/app"

export const SITE_TITLE = "Archstack Workspaces"
export const PRODUCT_NAME = "Archstack"

export const AUTH_API_URL =
  !DEV
    ? "??"
    : "http://localhost:3333"

export const WORKSPACE_API_URL =
  !DEV
    ? "??"
    : "http://localhost:3334"

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_LOGIN_URL = `${AUTH_API_URL}/login`
export const ENDPOINT_WORKSPACES_URL = `${WORKSPACE_API_URL}/user/workspaces`
