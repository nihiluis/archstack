import axios from "axios"
import { ENDPOINT_AUTH_URL, ENDPOINT_LOGIN_URL } from "../constants/env"
import protect from "await-protect"

interface AuthResult {
  success: boolean
  error: string
  token: string
}

export async function checkAuth(
  existingToken: string = ""
): Promise<AuthResult> {
  const headers: any = {}
  if (existingToken) {
    headers["Authorization"] = `Bearer ${existingToken}`
  }

  const [res, error] = await protect(
    axios.get(ENDPOINT_AUTH_URL, { headers, withCredentials: true })
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return { success: false, token: "", error: error.message }
  }

  const token: string = res.data.token

  return { success: true, token, error: "" }
}

export async function login(
  mail: string,
  password: string
): Promise<AuthResult> {
  const [res, error] = await protect(
    axios.post(
      ENDPOINT_LOGIN_URL,
      { mail, password },
      {
        withCredentials: true,
      }
    )
  )

  if (error || !res.data.hasOwnProperty("token")) {
    return { success: false, token: "", error: error.message }
  }

  const token: string = res.data.token

  return { success: true, token, error: "" }
}

const SESSION_TOKEN_KEY = "token"

export function getSessionToken(): string {
  return sessionStorage.getItem(SESSION_TOKEN_KEY)
}

export function setSessionToken(token: string) {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
}
