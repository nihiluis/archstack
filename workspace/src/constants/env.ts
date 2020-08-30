export const DEV = process.env.NODE_ENV !== "production"

export const BASE_PATH = "/app"

export const SITE_TITLE = "Archstack Workspaces"
export const PRODUCT_NAME = "Archstack"

export const AUTH_API_URL =
  !DEV
    ? "??"
    : "http://localhost:3333"
