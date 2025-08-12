import React from "react"
import { useChangePassword } from "../../hooks/auth/useChangePassword"

const ChangePasswordForm = () => {
  const { newPassword, setNewPassword, handlePasswordChange } = useChangePassword()

  return (
    <form onSubmit={handlePasswordChange} className="form-container">
      <div className="form-header">
        <h3 className="form-title">Смена пароля</h3>
      </div>
      
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">Новый пароль:</label>
          <input
            type="password"
            id="newPassword"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Введите новый пароль"
            required
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="form-btn primary">Обновить пароль</button>
      </div>
    </form>
  )
}

export default ChangePasswordForm 
