const DEV = process.env.NODE_ENV !== "production"

module.exports = {
  basePath: DEV ? "" : "/workspace-selection-app"
}
