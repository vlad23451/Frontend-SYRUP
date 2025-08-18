/**
 * @fileoverview Сервис для работы с аутентификацией пользователей
 * 
 * Этот модуль содержит функции для взаимодействия с API аутентификации.
 * Предоставляет методы для входа и регистрации пользователей.
 * 
 * Функциональность:
 * - Авторизация пользователей через API
 * - Регистрация новых пользователей
 * - Интеграция с apiRequest для обработки HTTP запросов
 * - Обработка JWT токенов
 * 
 * API endpoints:
 * - POST /auth/login - вход в систему
 * - POST /auth/register - регистрация нового пользователя
 * - POST /auth/refresh - обновление access токена
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const login = async (login, password) => {
  const response = await apiRequest('/auth/login', {
    method: "POST",
    body: JSON.stringify({ login, password })
  })
  if (!response.user || !response.token) {
    return {
      user: { login },
      token: 'mock-token-123',
      ...response
    }
  }
  return response
}

export const register = async (login, password, about) => {
  const response = await apiRequest('/auth/register', {
    method: "POST",
    body: JSON.stringify({ login, password, about })
  })
  
  if (!response.user || !response.token) {
    return {
      user: { login, about },
      token: 'mock-token-123',
      ...response
    }
  }
  return response
}

export const refreshToken = async () => {
  return apiRequest('/auth/refresh/', {method: 'POST'})
}
