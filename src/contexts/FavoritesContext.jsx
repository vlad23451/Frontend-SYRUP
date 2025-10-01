/**
 * @fileoverview Контекст для глобального управления избранными историями
 * 
 * Предоставляет глобальное состояние избранных историй для синхронизации
 * между всеми компонентами приложения.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getFavorites } from '../services/historyService'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites должен использоваться внутри FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async (force = false) => {
    if (loading || (isInitialized && !force)) {
      return
    }
    
    try {
      setLoading(true)
      const data = await getFavorites(0, 50) 
      
      // Проверяем, есть ли поле history_ids в ответе
      if (data && data.history_ids) {
        const numericIds = data.history_ids.map(id => Number(id))
        const favoritesSet = new Set(numericIds)
        setFavorites(favoritesSet)
      } else {
        // Fallback - загружаем полные данные
        const favoritesData = Array.isArray(data) ? data : (data?.items || [])
        const favoritesSet = new Set(favoritesData.map(fav => fav.history_id || fav.id))
        setFavorites(favoritesSet)
      }
      setIsInitialized(true)
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = (historyId) => {
    setFavorites(prev => new Set([...prev, historyId]))
  }

  const removeFromFavorites = (historyId) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      newSet.delete(historyId)
      return newSet
    })
  }

  const isFavorite = (historyId) => {
    const numericId = Number(historyId)
    return favorites.has(numericId)
  }

  const syncFavorites = (favoritesIds) => {
    const numericIds = favoritesIds.map(id => Number(id))
    const favoritesSet = new Set(numericIds)
    setFavorites(favoritesSet)
  }

  const value = {
    favorites,
    loading,
    isInitialized,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    loadFavorites,
    syncFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
