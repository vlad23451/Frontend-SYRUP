/**
 * @fileoverview Страница избранных историй
 * 
 * Отображает все истории, добавленные пользователем в избранное.
 * Использует компонент HistoryList для единообразного отображения.
 */

import React, { useState, useEffect, useRef } from 'react'
import { useHistoryFavorites } from '../hooks/useHistoryFavorites'
import HistoryList from '../components/histories/HistoryList'
import HistoriesLoading from '../components/histories/HistoriesLoading'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Favorites = () => {
  const { favoritesList, totalCount, loading, isLoadingMore, hasMore, loadFavorites, loadMoreFavorites } = useHistoryFavorites()
  const [error, setError] = useState(null)
  const isLoadingMoreRef = useRef(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null)
        await loadFavorites()
      } catch (err) {
        console.error('Ошибка загрузки избранного:', err)
        setError(err.message || 'Ошибка загрузки избранного')
      }
    }

    loadData()
  }, [])

  // Обработка скролла для пагинации
  useEffect(() => {
    let scrollTimeout = null
    
    const handleScroll = () => {
      if (scrollTimeout) return
      
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
        
        // Проверяем необходимость загрузки новой страницы
        if (
          hasMore && 
          !isLoadingMoreRef.current && 
          !isLoadingMore &&
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 800
        ) {
          console.log('📜 Scroll triggered: loading more favorites')
          isLoadingMoreRef.current = true
          loadMoreFavorites().finally(() => {
            isLoadingMoreRef.current = false
          })
        }
      }, 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [hasMore, isLoadingMore, loadMoreFavorites])

  const handleDeleteHistory = (deletedHistory) => {
    // После удаления истории обновляем список избранного
    loadFavorites()
  }

  const handleUpdateHistory = (updatedHistory) => {
    // После обновления истории обновляем список избранного
    loadFavorites()
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="favorites-error">
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (loading && favoritesList.length === 0) {
    return <LoadingSpinner />
  }

  // Теперь favoritesList уже содержит объекты историй из поля histories
  const histories = favoritesList

  return (
    <div className="page-container">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Избранное</h1>
          <p className="favorites-count">
            {totalCount} {totalCount === 1 ? 'история' : 'историй'} в избранном
          </p>
        </div>

        {histories.length === 0 ? (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>Пока ничего не добавлено</h2>
            <p>Добавляйте истории в избранное, чтобы легко найти их позже</p>
          </div>
        ) : (
          <>
            <HistoryList 
              histories={histories}
              isLoading={loading}
              onDeleteHistory={handleDeleteHistory}
              onUpdateHistory={handleUpdateHistory}
            />
            
            {loading && histories.length === 0 && <HistoriesLoading />}
            
            {isLoadingMore && histories.length > 0 && (
              <div className="pagination-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites
