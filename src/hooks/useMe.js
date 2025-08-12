import { useEffect } from "react"
import { useStore } from "../stores/StoreContext"

export const useMe = () => {
  const { profile } = useStore()

  useEffect(() => {
    profile.fetchProfile()
  }, [profile])

  return { 
    user: profile.user, 
    loading: profile.loading, 
    error: profile.error 
  }
}
