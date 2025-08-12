import { useState } from "react"

export const useChangePassword = () => {
  const [newPassword, setNewPassword] = useState("")

  const handlePasswordChange = (e) => {
    e.preventDefault()
    console.log("Новый пароль:", newPassword)
    setNewPassword("")
  }

  return { newPassword,
           setNewPassword,
           handlePasswordChange}
} 
