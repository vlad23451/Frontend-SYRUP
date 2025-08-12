import React from 'react'
import { Link } from 'react-router-dom'

const SwitchAuthLink = ({ isRegister }) => (
  <div className="auth-switch-link">
    {isRegister ? (
      <>
        Уже есть аккаунт?{' '}
        <Link to="/login">Войти</Link>
      </>
    ) : (
      <>
        Нет аккаунта?{' '}
        <Link to="/register">Зарегистрироваться</Link>
      </>
    )}
  </div>
)

export default SwitchAuthLink 
