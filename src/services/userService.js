/**
 * @fileoverview Сервис для работы с пользователями
 * 
 * Этот модуль содержит функции для взаимодействия с API пользователей.
 * Предоставляет методы для получения информации о текущем пользователе.
 * 
 * Функциональность:
 * - Получение данных текущего авторизованного пользователя
 * - Интеграция с apiRequest для обработки HTTP запросов
 * - Работа с профилем пользователя
 * 
 * API endpoints:
 * - GET /user/me - получение данных текущего пользователя
 * - GET /user/profile/:id - получение данных пользователя по id
 * - POST /followers/ - подписаться на пользователя
 * - DELETE /followers/ - отписаться от пользователя
 * - GET /user/search?q= - поиск пользователей по логину
 * - GET /friends/:id - получение друзей пользователя
 * - GET /followers/:id - получение подписчиков пользователя
 * - GET /following/:id - получение пользователей, на которых подписан текущий пользователь
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const getCurrentUser = async () => {
  return apiRequest('/user/me')
}

export const updateAvatar = async (avatarBase64) => {
  return apiRequest('/user/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({ avatar: avatarBase64 })
  })
}

export const getUserById = async (id) => {
  return apiRequest(`/user/profile/${id}`)
}

export const followUser = async (target_id) => {
  return apiRequest('/followers/', {
    method: 'POST',
    body: JSON.stringify({ target_id })
  })
}

export const unfollowUser = async (target_id) => {
  return apiRequest('/followers/', {
    method: 'DELETE',
    body: JSON.stringify({ target_id }),
  })
}

export const searchUsers = async (query) => {
  const params = `?q=${encodeURIComponent(query || '')}`
  return apiRequest(`/user/search${params}`)
}

export const getFriends = async (userId) => {
  return apiRequest(`/friends/${userId}`)
}

export const getFollowers = async (userId) => {
  return apiRequest(`/followers/${userId}`)
}

export const getFollowing = async (userId) => {
  return apiRequest(`/followers/following/${userId}`)
}
