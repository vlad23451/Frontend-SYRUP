/**
 * @fileoverview Сервис историй: CRUD + реакции и выборки лент
 *
 * Назначение:
 * - Инкапсулирует HTTP-вызовы для историй и их реакций
 * - Обеспечивает единый контракт для страниц/компонентов
 *
 * Основные функции:
 * - Списки: `getHistories`, `getMyHistories`, `getUserHistories`, `getFollowingHistories`, `getFriendsHistories`
 * - CRUD: `createHistory`, `updateHistory`, `deleteHistory`, `getHistoryById`
 * - Реакции: `createHistoryLike`, `deleteHistoryLike`, `createHistoryDislike`, `deleteHistoryDislike`
 *
 * Конвенции:
 * - Пагинация через skip/limit
 * - Ответы могут быть массивом или объектом `{ items }` — потребители обязаны нормализовать
 */

import { apiRequest } from '../utils/apiUtils'

export const getHistories = async (skip = 0, limit = 10) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) }).toString()
  return apiRequest(`/history/?${params}`)
}

export const getMyHistories = async () => {
  return apiRequest('/user/me/histories')
}

export const getFollowingHistories = async (skip = 0, limit = 10) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) }).toString()
  return apiRequest(`/history/following?${params}`)
}

export const getFriendsHistories = async (skip = 0, limit = 10) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) }).toString()
  return apiRequest(`/history/friends?${params}`)
}

export const getUserHistories = async (userId) => {
  return apiRequest(`/user/profile/${userId}/histories`)
}

export const createHistory = async (historyData) => {
  return apiRequest('/history', {
    method: 'POST',
    body: JSON.stringify(historyData)
  })
}

export const updateHistory = async (historyId, historyData) => {
  return apiRequest(`/history/${historyId}`, {
    method: 'PUT',
    body: JSON.stringify(historyData)
  })
}

export const deleteHistory = async (historyId) => {
  return apiRequest(`/history/${historyId}`, {
    method: 'DELETE',
    json: false
  })
}

export const getHistoryById = async (historyId) => {
  return apiRequest(`/history/${historyId}`)
}

export const createHistoryLike = async (historyId) => {
  return apiRequest('/likes', {
    method: 'POST',
    body: JSON.stringify({
      history_id: historyId
    })
  })
}

export const deleteHistoryLike = async (historyId) => {
  return apiRequest(`/likes/${historyId}`, {
    method: 'DELETE',
    json: false
  })
}

export const createHistoryDislike = async (historyId) => {
  return apiRequest('/dislikes', {
    method: 'POST',
    body: JSON.stringify({
      history_id: historyId
    })
  })
}

export const deleteHistoryDislike = async (historyId) => {
  return apiRequest(`/dislikes/${historyId}`, {
    method: 'DELETE',
    json: false
  })
}

export const getHistoriesByIds = async (ids) => {
  return apiRequest('/history/by-ids', {
    method: 'POST',
    body: JSON.stringify({ ids })
  })
}
