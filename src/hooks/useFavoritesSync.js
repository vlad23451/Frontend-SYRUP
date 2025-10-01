/**
 * @fileoverview Хук для синхронизации избранного с загруженными историями
 * 
 * Предоставляет функцию для синхронизации состояния избранного
 * при загрузке списков историй, когда API возвращает только ID избранных историй.
 */

import { useEffect } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'

export const useFavoritesSync = () => {
  const { syncFavorites, loadFavorites, isInitialized } = useFavorites()

  useEffect(() => {
    if (!isInitialized) {
      loadFavorites()
    }
  }, [isInitialized, loadFavorites])

  const syncHistoriesWithFavorites = (histories, favoritesField = 'history_ids') => {
    if (!Array.isArray(histories)) return histories

    if (histories.length > 0 && histories[0][favoritesField]) {
      const favoriteIds = histories[0][favoritesField]
      syncFavorites(favoriteIds)
    }

    return histories
  }

  const syncFromResponse = (response, favoritesField = 'history_ids') => {
    if (response && response[favoritesField] && Array.isArray(response[favoritesField])) {
      console.log('📡 Получены данные для синхронизации избранного:', response[favoritesField])
      syncFavorites(response[favoritesField])
    } else {
      console.log('⚠️ Поле избранного не найдено в ответе:', response)
    }
  }

  return {
    syncHistoriesWithFavorites,
    syncFromResponse
  }
}
