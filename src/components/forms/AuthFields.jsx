import React from 'react'

const AuthFields = ({ loginInput, setLoginInput, password, setPassword, about, setAbout, isRegister, loading }) => (
  <>
    <label className="auth-label">Логин</label>
    <input
      type="text"
      value={loginInput}
      onChange={(e) => setLoginInput(e.target.value)}
      placeholder="Введите логин"
      disabled={loading}
      required
      className="auth-input"
    />
    <label className="auth-label">Пароль</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Введите пароль"
      disabled={loading}
      required
      className="auth-input"
    />
    {isRegister && (
      <>
        <label className="auth-label">О себе</label>
        <textarea
          value={about}
          onChange={e => setAbout(e.target.value)}
          placeholder="Расскажите о себе"
          rows={3}
          className="auth-textarea"
          disabled={loading}
        />
      </>
    )}
  </>
)

export default AuthFields 
