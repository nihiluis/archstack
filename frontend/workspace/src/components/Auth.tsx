import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
} from "react"
import { useRouter } from "next/router"
import Head from "next/head"

import { checkAuth } from "../lib/auth"
import Loading from "./Loading"

interface AuthContextValues {
  auth: AuthState
  setAuth: (state: AuthState) => void
}

export const AuthContext = React.createContext<AuthContextValues>(undefined)

export interface AuthState {
  authenticated: boolean
  error: string
  token: string
}

interface Props {
  require: boolean
}

export default function Auth(props: PropsWithChildren<Props>) {
  const { require } = props

  const { auth, setAuth } = useContext(AuthContext)

  const router = useRouter()

  const [authLoading, setAuthLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.authenticated) {
        setAuthLoading(true)

        const { success, token, error } = await checkAuth()

        setAuthLoading(false)

        setAuth({ authenticated: success, token, error })
      } else if (authLoading) {
        setAuthLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (require && !auth.authenticated && !authLoading) {
      router.push("/login")
    }

    if (auth.authenticated && router.pathname === "/login") {
      router.push("/")
    }
  }, [auth])

  return (
    <React.Fragment>
      <Head>{authLoading && <title>Authenticating...</title>}</Head>
      {require && auth.authenticated && !authLoading && props.children}
      {authLoading && <Loading />}
      {!require && !authLoading && props.children}
    </React.Fragment>
  )
}
