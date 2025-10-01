/**
 * @fileoverview Хук для управления блокировками пользователей
 */

import { useState, useCallback } from 'react'
import { blockUser, unblockUser, getBlockedUsers } from '../services/userBlockService'

export const useUserBlocks = () => {
  const [blockedUsers, setBlockedUsers] = useState([])
  const [totalBlocked, setTotalBlocked] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const blockUserAction = useCallback(async (blockedUserId, reason = '') => {
    try {
      setLoading(true)
      setError(null)
      
      await blockUser(blockedUserId, reason)
      
      // Добавляем в локальный список в формате API
      setBlockedUsers(prev => [...prev, { 
        id: blockedUserId, // ID блокировки
        blocked: {
          id: blockedUserId,
          login: 'Пользователь', // Временное значение, будет обновлено при следующей загрузке
          about: '',
          avatar_url: null
        },
        reason: reason,
        created_at: new Date().toISOString()
      }])
      
      // Увеличиваем счетчик
      setTotalBlocked(prev => prev + 1)
      
      return { success: true }
    } catch (err) {
      setError(err.message || 'Ошибка при блокировке пользователя')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const unblockUserAction = useCallback(async (blockedUserId) => {
    try {
      setLoading(true)
      setError(null)
      
      await unblockUser(blockedUserId)
      
      // Удаляем по ID заблокированного пользователя
      setBlockedUsers(prev => prev.filter(block => block.blocked?.id !== blockedUserId))
      
      // Уменьшаем счетчик
      setTotalBlocked(prev => Math.max(0, prev - 1))
      
      return { success: true }
    } catch (err) {
      setError(err.message || 'Ошибка при разблокировке пользователя')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadBlockedUsers = useCallback(async (skip = 0, limit = 50) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getBlockedUsers(skip, limit)
      
      // API возвращает { items: [], total: number }
      const blockedUsersData = response?.items || []
      const total = response?.total || 0
      
      if (skip === 0) {
        setBlockedUsers(blockedUsersData)
        setTotalBlocked(total)
      } else {
        setBlockedUsers(prev => [...prev, ...blockedUsersData])
      }
      
      return { success: true, data: blockedUsersData, total }
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке заблокированных пользователей')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const isUserBlocked = useCallback((userId) => {
    return blockedUsers.some(block => block.blocked?.id === userId)
  }, [blockedUsers])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    blockedUsers,
    totalBlocked,
    loading,
    error,
    blockUserAction,
    unblockUserAction,
    loadBlockedUsers,
    isUserBlocked,
    clearError
  }
}
