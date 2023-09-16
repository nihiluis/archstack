export function getDefaultHeaders() {
  const headers: any = {}

  if (process.env.NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER) {
    headers["Authelia-Authorization"] =
      process.env.NEXT_PUBLIC_PROXY_AUTHORIZATION_HEADER
    headers["Proxy-Authorization"] =
      process.env.PROXY_AUTHORIZATION_HEADER
  }
  if (process.env.PROXY_AUTHORIZATION_HEADER) {
    headers["Authelia-Authorization"] =
      process.env.PROXY_AUTHORIZATION_HEADER
    headers["Proxy-Authorization"] =
      process.env.PROXY_AUTHORIZATION_HEADER
  }

  console.log("headers=" + JSON.stringify(headers))

  return headers
}
