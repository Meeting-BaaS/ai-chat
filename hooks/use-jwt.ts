import { JwtContext } from "@/contexts/jwt-context"
import { useContext } from "react"

export function useJwt() {
  const context = useContext(JwtContext)
  if (context === undefined) {
    throw new Error("useJwt must be used within a JwtProvider")
  }
  return context.jwt
}
