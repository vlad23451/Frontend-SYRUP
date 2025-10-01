/**
 * @fileoverview Кнопка добавления истории в избранное
 * 
 * Отображает звездочку рядом с меню действий истории.
 * При добавлении в избранное становится ярко-желтой.
 */

import React from 'react'
import { useFavorites } from '../../contexts/FavoritesContext'
import { useHistoryFavorites } from '../../hooks/useHistoryFavorites'
import './FavoriteButton.css'

const FavoriteButton = ({ historyId }) => {
  const { isFavorite } = useFavorites()
  const { toggleFavorite } = useHistoryFavorites()

  const isCurrentlyFavorite = isFavorite(historyId)
  
  const handleClick = (e) => {
    e.stopPropagation()
    toggleFavorite(historyId)
  }

  return (
    <div
      className={`favorite-button ${isFavorite(historyId) ? 'favorite-button-active' : ''}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e)
        }
      }}
      title={isFavorite(historyId) ? 'Удалить из избранного' : 'Добавить в избранное'}
      aria-label={isFavorite(historyId) ? 'Удалить из избранного' : 'Добавить в избранное'}
      role="button"
      tabIndex="0"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    </div>
  )
}

export default FavoriteButton
