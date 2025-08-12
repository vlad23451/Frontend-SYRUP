/**
 * @fileoverview Страница авторизации пользователя
 * 
 * Этот компонент представляет страницу входа в систему.
 * Использует универсальный компонент AuthForm с параметром isRegister={false}
 * для отображения формы входа вместо регистрации.
 * 
 * Функциональность:
 * - Отображение формы авторизации
 * - Передача параметра isRegister={false} в AuthForm
 * - Интеграция с системой аутентификации
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import AuthForm from '../components/forms/AuthForm'

const Login = () => {
  return (
    <div className="auth-page">
      <AuthForm isRegister={false} />
    </div>
  )
}

export default Login
