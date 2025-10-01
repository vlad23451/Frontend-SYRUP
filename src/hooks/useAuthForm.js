/**
 * @fileoverview Хук для управления формой авторизации
 * 
 * Этот хук предоставляет логику для обработки форм входа и регистрации.
 * Управляет состоянием формы, валидацией и отправкой данных на сервер.
 * 
 * Функциональность:
 * - Управление состоянием полей формы (логин, пароль)
 * - Обработка отправки формы
 * - Интеграция с сервисами авторизации
 * - Навигация после успешной авторизации
 * - Обработка ошибок
 * 
 * Состояния:
 * - loginInput: значение поля логин
 * - password: значение поля пароля
 * - error: сообщение об ошибке
 * - loading: состояние загрузки запроса
 * 
 * Возвращаемые значения:
 * - loginInput, setLoginInput: поле логина и его сеттер
 * - password, setPassword: поле пароля и его сеттер
 * - error: текущая ошибка
 * - loading: состояние загрузки
 * - handleSubmit: функция обработки отправки формы
 * 
 * @param {boolean} isRegister - флаг режима формы (true - регистрация, false - вход)
 * @returns {Object} объект с состоянием формы и функциями управления
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { login, register } from '../services/authService'
import { useStore } from '../stores/StoreContext'
import { useToast } from '../contexts/ToastContext'

export const useAuthForm = (isRegister) => {
  const [loginInput, setLoginInput] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useStore()
  const { error: showErrorToast } = useToast()

  const handleSubmit = async (e, extra = {}) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let response

      if (isRegister) {
        response = await register(loginInput, password, extra.about)
        
        if (response.user) {
          auth.setUser({ ...response.user })
          try { 
            const userId = response.user_id || response.user.id || response.user.user_id
            if (userId) localStorage.setItem('user_id', String(userId))
          } catch {}
        } else {
          auth.setUser(null)
          try { localStorage.removeItem('user_id') } catch {}
        }
      } else {
        response = await login(loginInput, password)
        
        if (response.user) {
          auth.setUser({ ...response.user })
          try { 
            const userId = response.user_id || response.user.id || response.user.user_id
            if (userId) localStorage.setItem('user_id', String(userId))
          } catch {}
        } else {
          auth.setUser(null)
          try { localStorage.removeItem('user_id') } catch {}
        }
      }
      
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      if (error.isLoginError && error.status === 400) {
        showErrorToast('Неверный логин или пароль', 5000)
        setError('')
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return {loginInput,
          setLoginInput,
          password,
          setPassword,
          error,
          loading,
          handleSubmit}
}
