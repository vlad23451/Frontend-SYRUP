/**
 * @fileoverview Универсальная форма авторизации и регистрации
 * 
 * Этот компонент представляет универсальную форму для входа и регистрации пользователей.
 * В зависимости от параметра isRegister отображает соответствующий интерфейс.
 * 
 * Функциональность:
 * - Универсальная форма для входа и регистрации
 * - Валидация полей формы
 * - Обработка ошибок авторизации
 * - Интеграция с хуком useAuthForm
 * 
 * Состояния:
 * - loginInput: поле логина/email
 * - password: поле пароля
 * - about: поле "О себе" (только для регистрации)
 * - error: ошибка авторизации
 * - loading: состояние загрузки
 * 
 * Компоненты:
 * - AuthFields: поля формы
 * - SwitchAuthLink: ссылка для переключения между входом и регистрацией
 * 
 * @param {boolean} isRegister - флаг режима формы (true - регистрация, false - вход)
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { useAuthForm } from '../../hooks/useAuthForm'
import AuthFields from './AuthFields'
import SwitchAuthLink from './SwitchAuthLink'

const AuthForm = ({ isRegister }) => {
  const { loginInput, setLoginInput, password, setPassword, error, loading, handleSubmit: baseHandleSubmit } = useAuthForm(isRegister)
  const [about, setAbout] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isRegister) {
      baseHandleSubmit(e, { about })
    } else {
      baseHandleSubmit(e)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-title">
        {isRegister ? 'Регистрация' : 'Вход'}
      </h2>
      {error && <div className="auth-error">Ошибка: {error}</div>}
      
      <AuthFields
        loginInput={loginInput}
        setLoginInput={setLoginInput}
        password={password}
        setPassword={setPassword}
        about={about}
        setAbout={setAbout}
        isRegister={isRegister}
        loading={loading}
      />
      
      <button type="submit" disabled={loading} className="auth-submit-btn">
        {loading
          ? isRegister ? "Регистрация..." : "Вход..."
          : isRegister ? "Зарегистрироваться" : "Войти"}
      </button>
      
      <SwitchAuthLink isRegister={isRegister} />
    </form>
  )
}

export default AuthForm 
