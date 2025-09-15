/**
 * @fileoverview Главная страница с историями (упрощенная версия)
 * 
 * Простая пагинация без MobX сторов и сложной логики:
 * - Локальный state для массива историй
 * - При скролле загружается следующая страница
 * - Данные просто добавляются к существующему массиву
 */

import React, { useState, useEffect, useRef } from 'react'
import { getHistories } from '../services/historyService'
import HistoryList from '../components/histories/HistoryList'
import HistoriesLoading from '../components/histories/HistoriesLoading'
import CreateHistoryButton from '../components/histories/CreateHistoryButton'
import CreateHistoryModal from '../components/histories/CreateHistoryModal'

const Histories = () => {
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const isLoadingMore = useRef(false)
  const PAGE_LIMIT = 10
  
  // Загрузка первой страницы
  const loadFirstPage = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getHistories(0, PAGE_LIMIT)
      const items = Array.isArray(data) ? data : (data?.items || [])
      
      setHistories(items)
      setPage(1) // следующая страница будет 1
      setHasMore(items.length >= PAGE_LIMIT)
      
      console.log('📄 Loaded first page:', items.length, 'items')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFirstPage()
  }, [])

  const loadNextPage = async () => {
    if (isLoadingMore.current || loading || !hasMore) return
    
    isLoadingMore.current = true
    setLoading(true)
    
    const skip = page * PAGE_LIMIT
    console.log('📄 Loading next page:', page, 'skip:', skip)
    
    try {
      const data = await getHistories(skip, PAGE_LIMIT)
      const items = Array.isArray(data) ? data : (data?.items || [])
      console.log('📦 Received items:', items.length)
      
      // Добавляем к существующему массиву
      setHistories(prev => [...prev, ...items])
      
      // Увеличиваем номер страницы для следующего запроса
      setPage(prev => prev + 1)
      
      // Если пришло меньше чем лимит - это конец
      if (items.length < PAGE_LIMIT) {
        setHasMore(false)
        console.log('🛑 No more data')
      }
    } catch (err) {
      console.error('📄 Pagination error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
          isLoadingMore.current = false
    }
  }

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
          !isLoadingMore.current && 
          !loading &&
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
        ) {
          console.log('📜 Scroll triggered: loading next page')
          loadNextPage()
        }
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [hasMore, loading])

  const handleCreateSuccess = () => {
    // После создания новой истории - перезагружаем первую страницу
    setIsCreateOpen(false)
    loadFirstPage()
  }

  if (error) {
    return (
      <div className="histories-error">
        <h2>Ошибка загрузки</h2>
        <p>{error}</p>
        <button onClick={loadFirstPage}>Попробовать снова</button>
      </div>
    )
  }

  return (
    <div className="page-container">
    <div className="histories-container">
        <div className="create-history-section">
          <CreateHistoryButton onClick={() => {
          console.log('🔵 Setting isCreateOpen to true')
          setIsCreateOpen(true)
        }} />
        </div>

        <HistoryList histories={histories} isLoading={loading && histories.length === 0} />
        
        {loading && histories.length === 0 && <HistoriesLoading />}
        
        {loading && histories.length > 0 && (
          <div className="pagination-loading">
            <div className="loading-spinner">Загрузка...</div>
          </div>
        )}

          <CreateHistoryModal 
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  )
}

export default Histories
