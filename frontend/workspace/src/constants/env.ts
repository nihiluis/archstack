export const DEV = process.env.NODE_ENV !== "production"

export const BASE_PATH = "/app"

export const SITE_TITLE = "Archstack Workspaces"
export const PRODUCT_NAME = "Archstack"

export const AUTH_API_URL =
  !DEV
    ? "??"
    : "http://localhost:3333"

export const ENDPOINT_AUTH_URL = `${AUTH_API_URL}/auth`
export const ENDPOINT_LOGIN_URL = `${AUTH_API_URL}/login`
