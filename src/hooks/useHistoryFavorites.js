/**
 * @fileoverview Хук для управления избранными историями
 * 
 * Предоставляет функциональность для добавления/удаления историй из избранного
 * и отслеживания состояния загрузки. Использует глобальное состояние из FavoritesContext.
 */

import { useState, useEffect } from 'react'
import { addToFavorites, removeFromFavorites, getFavorites } from '../services/historyService'
import { useToast } from '../contexts/ToastContext'
import { useFavorites } from '../contexts/FavoritesContext'

export const useHistoryFavorites = () => {
  const { isFavorite, addToFavorites: addToFavoritesGlobal, removeFromFavorites: removeFromFavoritesGlobal, loadFavorites: loadFavoritesGlobal } = useFavorites()
  const [loading, setLoading] = useState(false)
  const [favoritesList, setFavoritesList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const { success, error } = useToast()
  const PAGE_LIMIT = 10

  useEffect(() => {
    loadFavoritesGlobal()
  }, [loadFavoritesGlobal])

  const loadFavorites = async (reset = false) => {
    try {
      setLoading(true)
      const skip = reset ? 0 : page * PAGE_LIMIT
      const data = await getFavorites(skip, PAGE_LIMIT)
      
      // Используем поля histories и total из ответа API
      const histories = data?.histories || []
      const total = data?.total || 0
      
      if (reset) {
        setFavoritesList(histories)
        setTotalCount(total)
        setPage(1)
      } else {
        setFavoritesList(prev => [...prev, ...histories])
        setPage(prev => prev + 1)
      }
      
      if (histories.length < PAGE_LIMIT) {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreFavorites = async () => {
    if (isLoadingMore || !hasMore) return
    
    try {
      setIsLoadingMore(true)
      const skip = page * PAGE_LIMIT
      const data = await getFavorites(skip, PAGE_LIMIT)
      
      // Используем поля histories и total из ответа API
      const histories = data?.histories || []
      const total = data?.total || 0
      
      setFavoritesList(prev => [...prev, ...histories])
      setTotalCount(total) // Обновляем общее количество
      setPage(prev => prev + 1)
      
      if (histories.length < PAGE_LIMIT) {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Ошибка загрузки дополнительных избранных:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const toggleFavorite = async (historyId) => {
    const isCurrentlyFavorite = isFavorite(historyId)
    
    try {
      setLoading(true)
      
      if (isCurrentlyFavorite) {
        await removeFromFavorites(historyId)
        removeFromFavoritesGlobal(historyId)
        // Удаляем из локального списка
        setFavoritesList(prev => prev.filter(fav => (fav.history_id || fav.id) !== historyId))
        success('История удалена из избранного')
      } else {
        await addToFavorites(historyId)
        addToFavoritesGlobal(historyId)
        success('История добавлена в избранное')
        // Перезагружаем список для получения полной информации об истории
        await loadFavorites(true)
      }
      
    } catch (err) {
      console.error('Ошибка изменения избранного:', err)
      error(isCurrentlyFavorite ? 'Не удалось удалить из избранного' : 'Не удалось добавить в избранное')
    } finally {
      setLoading(false)
    }
  }

  const addToFavoritesAction = async (historyId) => {
    if (isFavorite(historyId)) return
    
    try {
      setLoading(true)
      await addToFavorites(historyId)
      addToFavoritesGlobal(historyId)
      success('История добавлена в избранное')
      await loadFavorites(true)
    } catch (err) {
      console.error('Ошибка добавления в избранное:', err)
      error('Не удалось добавить в избранное')
    } finally {
      setLoading(false)
    }
  }

  const removeFromFavoritesAction = async (historyId) => {
    if (!isFavorite(historyId)) return
    
    try {
      setLoading(true)
      await removeFromFavorites(historyId)
      removeFromFavoritesGlobal(historyId)
      // Удаляем из локального списка
      setFavoritesList(prev => prev.filter(fav => (fav.history_id || fav.id) !== historyId))
      // Уменьшаем общее количество
      setTotalCount(prev => Math.max(0, prev - 1))
      success('История удалена из избранного')
    } catch (err) {
      console.error('Ошибка удаления из избранного:', err)
      error('Не удалось удалить из избранного')
    } finally {
      setLoading(false)
    }
  }

  return {
    favoritesList,
    totalCount,
    loading,
    isLoadingMore,
    hasMore,
    isFavorite,
    toggleFavorite,
    addToFavorites: addToFavoritesAction,
    removeFromFavorites: removeFromFavoritesAction,
    loadFavorites: () => loadFavorites(true),
    loadMoreFavorites
  }
}
