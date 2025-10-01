import React, { useState, useEffect, useCallback } from 'react'
import { searchMessages } from '../../services/searchService'
import SearchResultItem from './SearchResultItem'
import ModalHeader from '../ui/ModalHeader'

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const limit = 20

  const performSearch = useCallback(async (searchQuery, searchOffset = 0, reset = true) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotalCount(0)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await searchMessages(searchQuery, limit, searchOffset)

      if (reset) {
        setResults(response.results || [])
      } else {
        setResults(prev => [...prev, ...(response.results || [])])
      }
      
      setTotalCount(response.total_count || 0)
      setHasMore(response.has_more || false)
      setOffset(searchOffset)
    } catch (err) {
      setError(err.message || 'Ошибка при поиске')
      if (reset) {
        setResults([])
        setTotalCount(0)
        setHasMore(false)
      }
    } finally {
      setLoading(false)
    }
  }, [limit])

  const handleSearch = useCallback(() => {
    setOffset(0)
    performSearch(query, 0, true)
  }, [query, performSearch])

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      performSearch(query, offset + limit, false)
    }
  }, [query, offset, limit, hasMore, loading, performSearch])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleChatClick = (chatId) => {
    onClose()
    // Здесь можно добавить навигацию к чату
    console.log('Переход к чату:', chatId)
  }

  const handleMessageClick = (chatId, messageId) => {
    onClose()
    // Здесь можно добавить навигацию к сообщению
    console.log('Переход к сообщению:', chatId, messageId)
  }

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setError(null)
      setTotalCount(0)
      setHasMore(false)
      setOffset(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop" onClick={(e) => e.target.classList.contains('custom-modal-backdrop') && onClose()}>
      <div className="custom-modal global-search-modal">
        <ModalHeader title="Поиск по всем чатам" onClose={onClose} />
        
        <div className="global-search-content">
          <div className="search-input-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Введите поисковый запрос..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <button 
                className="search-button"
                onClick={handleSearch}
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="search-results">
            {error && (
              <div className="search-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Ошибка: {error}
              </div>
            )}

            {totalCount > 0 && (
              <div className="search-results-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4"/>
                  <path d="M15 11h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4"/>
                  <path d="M9 7H5a2 2 0 0 0-2 2v1"/>
                  <path d="M15 7h4a2 2 0 0 1 2 2v1"/>
                </svg>
                Найдено сообщений: {totalCount}
              </div>
            )}

            {results.length > 0 && (
              <div className="search-results-list">
                {results.map((result, index) => (
                  <SearchResultItem
                    key={`${result.message.chat_id}-${result.message.id}-${index}`}
                    result={result}
                    onChatClick={handleChatClick}
                    onMessageClick={handleMessageClick}
                  />
                ))}
              </div>
            )}

            {hasMore && (
              <button 
                className="load-more-button"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    Загрузка...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18"/>
                      <path d="M3 12h18"/>
                      <path d="M3 18h18"/>
                    </svg>
                    Загрузить еще
                  </>
                )}
              </button>
            )}

            {!loading && query.trim() && results.length === 0 && !error && (
              <div className="search-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>Сообщения не найдены</p>
                <span>Попробуйте изменить поисковый запрос</span>
              </div>
            )}

            {!query.trim() && (
              <div className="search-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M13 8H7"/>
                  <path d="M17 12H7"/>
                </svg>
                <p>Поиск по всем чатам</p>
                <span>Введите запрос для поиска сообщений</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearchModal
