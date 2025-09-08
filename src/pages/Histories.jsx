/**
 * @fileoverview Главная страница с историей чатов
 * 
 * Этот компонент представляет главную страницу приложения, которая отображает:
 * - Список всех историй чатов пользователя
 * - Заголовок страницы с навигацией
 * - Состояние загрузки данных
 * 
 * Функциональность:
 * - Получение данных историй через хук useHistories
 * - Отображение состояния загрузки
 * - Рендеринг списка историй
 * - Интеграция с компонентами HistoriesHeader и HistoryList
 * 
 * Состояния:
 * - loading: отображение компонента загрузки
 * - histories: список историй для отображения
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { getHistories } from '../services/historyService'
import HistoryList from '../components/histories/HistoryList'
import HistoriesLoading from '../components/histories/HistoriesLoading'
import CreateHistoryButton from '../components/histories/CreateHistoryButton'
import CreateHistoryModal from '../components/histories/CreateHistoryModal'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'

// Ключи для sessionStorage
const SCROLL_POSITION_KEY = 'histories_scroll_position'
const HISTORIES_DATA_KEY = 'histories_cached_data'
const HISTORIES_PAGE_KEY = 'histories_current_page'

// Функции для работы с sessionStorage
const saveScrollState = (scrollY, histories, page) => {
  try {
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(HISTORIES_DATA_KEY, JSON.stringify(histories))
    sessionStorage.setItem(HISTORIES_PAGE_KEY, page.toString())
  } catch (err) {
    console.warn('Failed to save scroll state:', err)
  }
}

const getScrollState = () => {
  try {
    const scrollY = parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || '0', 10)
    const histories = JSON.parse(sessionStorage.getItem(HISTORIES_DATA_KEY) || '[]')
    const page = parseInt(sessionStorage.getItem(HISTORIES_PAGE_KEY) || '0', 10)
    return { scrollY, histories, page }
  } catch (err) {
    console.warn('Failed to restore scroll state:', err)
    return { scrollY: 0, histories: [], page: 0 }
  }
}

const clearScrollState = () => {
  try {
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    sessionStorage.removeItem(HISTORIES_DATA_KEY)
    sessionStorage.removeItem(HISTORIES_PAGE_KEY)
  } catch (err) {
    console.warn('Failed to clear scroll state:', err)
  }
}

const Histories = observer(() => {
  const { auth } = useStore()
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const PAGE_LIMIT = 10
  
  // Всегда начинаем с page = 0, логика восстановления skip в useEffect
  const [page, setPage] = useState(0)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const isInitialized = useRef(false)
  const isLoadingMore = useRef(false)
  const hasMoreData = useRef(true)
  const isRestoringFromStorage = useRef(false)

  const reloadHistories = useCallback(async () => {
    setLoading(true)
    setError(null)
    isLoadingMore.current = false
    hasMoreData.current = true
    isRestoringFromStorage.current = false
    
    // Очищаем сохраненное состояние при перезагрузке
    clearScrollState()
    
    try {
      const data = await getHistories(0, PAGE_LIMIT)
      const items = Array.isArray(data) ? data : (data?.items || [])
      setHistories(items)
      setPage(0)
      // Проверяем, есть ли еще данные
      if (items.length < PAGE_LIMIT) {
        hasMoreData.current = false
      }
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Первая загрузка данных с восстановлением состояния
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      setLoading(true)
      
      // Пытаемся восстановить состояние из sessionStorage
      const savedState = getScrollState()
      
      if (savedState.histories.length > 0 && savedState.page >= 0) {
        // Восстанавливаем сохраненные данные
        console.log('Restoring saved histories state:', savedState)
        setHistories(savedState.histories)
        setPage(savedState.page)
        
        if (savedState.histories.length >= (savedState.page + 1) * PAGE_LIMIT) {
          hasMoreData.current = true
        } else {
          hasMoreData.current = false
        }
        
        // Восстанавливаем позицию скролла после рендера
        setTimeout(() => {
          window.scrollTo(0, savedState.scrollY)
          setLoading(false)
        }, 100)
        
        return
      }
      
      // Если нет сохраненного состояния, загружаем с начала
      getHistories(0, PAGE_LIMIT)
        .then(data => {
          const items = Array.isArray(data) ? data : (data?.items || [])
          setHistories(items)
          
          // Проверяем, есть ли еще данные
          if (items.length < PAGE_LIMIT) {
            hasMoreData.current = false
          }
          
          window.scrollTo(0, 0)
        })
        .catch(err => setError(err.message))
        .finally(() => {
          setLoading(false)
          isRestoringFromStorage.current = false
        })
    }
  }, [])

  // Загрузка при пагинации (только для page > 0 и не во время восстановления)
  useEffect(() => {
    if (page > 0 && isInitialized.current && !isLoadingMore.current && hasMoreData.current && !isRestoringFromStorage.current) {
      isLoadingMore.current = true
      setLoading(true)
      const skip = page * PAGE_LIMIT
      getHistories(skip, PAGE_LIMIT)
        .then(data => {
          const items = Array.isArray(data) ? data : (data?.items || [])
          setHistories(prev => [...prev, ...items])
          // Проверяем, есть ли еще данные
          if (items.length < PAGE_LIMIT) {
            hasMoreData.current = false
          }
        })
        .catch(err => setError(err.message))
        .finally(() => {
          setLoading(false)
          isLoadingMore.current = false
        })
    }
  }, [page])

  useEffect(() => {
    let scrollTimeout = null
    
    const handleScroll = () => {
      // Сохраняем позицию скролла в sessionStorage
      const currentScrollY = window.scrollY
      
      // Throttling для предотвращения слишком частых вызовов
      if (scrollTimeout) return
      
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
        
        // Сохраняем текущее состояние
        saveScrollState(currentScrollY, histories, page)
        
        // Проверяем все условия перед загрузкой новой страницы
        if (
          hasMoreData.current && 
          !isLoadingMore.current && 
          !loading &&
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
        ) {
          setPage(prevPage => prevPage + 1)
        }
      }, 100) // Throttling на 100ms
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [loading, histories, page])

  // Сохранение состояния при размонтировании компонента
  useEffect(() => {
    return () => {
      // Сохраняем последнее состояние при уходе со страницы
      saveScrollState(window.scrollY, histories, page)
    }
  }, [histories, page])

  if (error) {
    return <div className="error">Ошибка: {error}</div>
  }

  return (
    <div className="histories-container">
      {auth.isAuthenticated && (
        <>
          <CreateHistoryButton onClick={() => setIsCreateOpen(true)} />
          <CreateHistoryModal 
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={reloadHistories}
            authorId={auth.user?.id}
          />
        </>
      )}
      <HistoryList 
        histories={histories} 
        onDeleteHistory={(historyId) => {
          setHistories(prev => prev.filter(history => history.id !== historyId))
        }}
        onUpdateHistory={(updated) => {
          if (!updated || !updated.id) return
          setHistories(prev => prev.map(h => (h.id === updated.id ? { ...h, ...updated } : h)))
        }}
      />
      {loading && <HistoriesLoading />}
    </div>
  )
})

export default Histories
