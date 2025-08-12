/**
 * @fileoverview Страница регистрации пользователя
 * 
 * Этот компонент представляет страницу регистрации новых пользователей.
 * Использует универсальный компонент AuthForm с параметром isRegister={true}
 * для отображения формы регистрации вместо входа.
 * 
 * Функциональность:
 * - Отображение формы регистрации
 * - Передача параметра isRegister={true} в AuthForm
 * - Интеграция с системой аутентификации
 * - Создание новых аккаунтов пользователей
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import AuthForm from '../components/forms/AuthForm'

const Register = () => {
  return (
    <div className="auth-page">
      <AuthForm isRegister={true} />
    </div>
  )
}

export default Register
