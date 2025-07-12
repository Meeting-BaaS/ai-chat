"use client"

import { createContext } from "react"

interface JwtContextType {
  jwt: string
}

export const JwtContext = createContext<JwtContextType | undefined>(undefined)

export function JwtProvider({
  children,
  jwt
}: Readonly<{
  children: React.ReactNode
  jwt: string
}>) {
  return <JwtContext.Provider value={{ jwt }}>{children}</JwtContext.Provider>
}
