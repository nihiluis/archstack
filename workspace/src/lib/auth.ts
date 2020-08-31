import axios from "axios"
import { ENDPOINT_AUTH_URL, ENDPOINT_LOGIN_URL } from "../constants/env"
import protect from "await-protect"

interface AuthResult {
  success: boolean
  error: string
  token: string
}

export async function checkAuth(): Promise<AuthResult> {
  const [res, error] = await protect(
    axios.get(ENDPOINT_AUTH_URL, { withCredentials: true })
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
