/**
 * @fileoverview Утилиты для работы с API
 * 
 * Этот модуль содержит базовые функции для взаимодействия с серверным API.
 * Предоставляет унифицированный интерфейс для HTTP запросов с автоматической
 * обработкой ошибок и настройкой заголовков.
 * 
 * Функциональность:
 * - Унифицированные HTTP запросы к API
 * - Автоматическая настройка заголовков для разных типов запросов
 * - Обработка ошибок HTTP запросов
 * - Поддержка cookies для аутентификации
 * - Парсинг JSON ответов
 * 
 * Конфигурация:
 * - BASE_URL: базовый URL API сервера (http://localhost:8000)
 * 
 * Особенности:
 * - GET запросы не требуют Content-Type заголовка
 * - POST/PUT/DELETE запросы автоматически получают application/json
 * - Все запросы включают credentials для работы с cookies
 * - Ошибки автоматически парсятся из JSON ответа
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 * 
 * 
 */

import authStore from "../stores/AuthStore"

//const BASE_URL = 'https://myprojectfastapi.loca.lt'

const BASE_URL = 'http://localhost:8000'

export const apiRequest = async (endpoint, options = {}) => {
  const isGet = !options.method || options.method === "GET"
  const isFormData = options.body instanceof FormData
  
  const fetchOptions = isGet
    ? { credentials: "include", ...options }
    : {
        headers: isFormData 
          ? { ...(options.headers || {}) } // Для FormData не добавляем Content-Type
          : { "Content-Type": "application/json", ...(options.headers || {}) },
        credentials: "include",
        ...options,
      }

  let response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions)

  if ((response.status === 400 || response.status === 401 || response.status === 403) && !endpoint.startsWith('/auth/refresh')) {
    const refreshed = await authStore.tryRefreshToken()
    if (refreshed) {
      response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions)
    }
  }
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || "Ошибка запроса")
  }
  
  if (options.json === false) {
    return response
  }
  return response.json()
}
