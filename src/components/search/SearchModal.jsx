import React, { useState, useEffect, useCallback } from 'react'
import { searchMessages, searchMessagesInChat } from '../../services/searchService'
import SearchResultItem from './SearchResultItem'
import ModalHeader from '../ui/ModalHeader'

const SearchModal = ({ isOpen, onClose, currentChatId = null }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [searchType, setSearchType] = useState(currentChatId ? 'chat' : 'all')

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
      let response
      if (searchType === 'chat' && currentChatId) {
        response = await searchMessagesInChat(searchQuery, currentChatId, limit, searchOffset)
      } else {
        response = await searchMessages(searchQuery, limit, searchOffset)
      }

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
  }, [searchType, currentChatId, limit])

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
    // Переход к чату
    onClose()
    // Здесь можно добавить навигацию к чату
    console.log('Переход к чату:', chatId)
  }

  const handleMessageClick = (chatId, messageId) => {
    // Переход к конкретному сообщению
    onClose()
    // Здесь можно добавить навигацию к сообщению
    console.log('Переход к сообщению:', chatId, messageId)
  }

  const handleSearchTypeChange = (type) => {
    setSearchType(type)
    setResults([])
    setTotalCount(0)
    setHasMore(false)
    setOffset(0)
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
      <div className="custom-modal search-modal">
        <ModalHeader title="Поиск сообщений" onClose={onClose} />
        
        <div className="search-modal-content">
          <div className="search-type-selector">
            <button 
              className={`search-type-btn ${searchType === 'all' ? 'active' : ''}`}
              onClick={() => handleSearchTypeChange('all')}
              disabled={!!currentChatId}
            >
              Все чаты
            </button>
            <button 
              className={`search-type-btn ${searchType === 'chat' ? 'active' : ''}`}
              onClick={() => handleSearchTypeChange('chat')}
            >
              Текущий чат
            </button>
          </div>

          <div className="search-input-container">
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
              {loading ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          <div className="search-results">
            {error && (
              <div className="search-error">
                Ошибка: {error}
              </div>
            )}

            {totalCount > 0 && (
              <div className="search-results-header">
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
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            )}

            {!loading && query.trim() && results.length === 0 && !error && (
              <div className="search-empty">
                Сообщения не найдены
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
