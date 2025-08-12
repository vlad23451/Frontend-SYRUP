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

import React, { useEffect, useState, useCallback } from 'react'
import { getHistories } from '../services/historyService'
import HistoryList from '../components/histories/HistoryList'
import HistoriesLoading from '../components/histories/HistoriesLoading'
import CreateHistoryButton from '../components/histories/CreateHistoryButton'
import CreateHistoryModal from '../components/histories/CreateHistoryModal'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'

const Histories = observer(() => {
  const { auth } = useStore()
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const PAGE_LIMIT = 10
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const reloadHistories = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getHistories(0, PAGE_LIMIT)
      setHistories(Array.isArray(data) ? data : (data?.items || []))
      setPage(0)
      window.scrollTo(0, 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    const skip = page * PAGE_LIMIT
    getHistories(skip, PAGE_LIMIT)
      .then(data => {
        setHistories(prev => [...prev, ...(Array.isArray(data) ? data : (data?.items || []))])
      })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        setPage(prevPage => prevPage + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
