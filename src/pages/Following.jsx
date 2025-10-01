/**
 * @fileoverview Лента подписок
 * 
 * Страница отображает истории:
 * - Подписок (по умолчанию)
 * - Друзей (при tab=friends)
 * 
 * Архитектура:
 * - Источники данных инкапсулированы в сервисах historyService
 * - Состояние страницы (histories/loading/error) локальное, без MobX
 * - Обновления карточек (удаление/редактирование) выполняются иммутабельно
 */
import React, { useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'
import { getFollowingHistories, getFriendsHistories } from '../services/historyService'
import { useLocation } from 'react-router-dom'
import HistoryList from '../components/histories/HistoryList'
import HistoriesLoading from '../components/histories/HistoriesLoading'

const Following = observer(() => {
  const { auth } = useStore()
  const location = useLocation()
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadFeed = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(location.search)
      const tab = params.get('tab')
      const isFriends = tab === 'friends'
      const data = isFriends
        ? await getFriendsHistories(0, 10)
        : await getFollowingHistories(0, 10)
      
      // Синхронизация избранного происходит автоматически при загрузке приложения
      
      setHistories(Array.isArray(data) ? data : (data?.items || []))
    } catch (e) {
      setError(e?.message || 'Не удалось загрузить ленту подписок')
    } finally {
      setLoading(false)
    }
  }, [auth?.isAuthenticated, location.search])

  useEffect(() => { loadFeed() }, [auth?.isAuthenticated, location.search])

  if (error) {
    return <div className="error">Ошибка: {error}</div>
  }

  return (
    <div className="histories-container">
      {/* Список ленты подписок/друзей. Удаление и обновление — локально, без перезапроса. */}
      <HistoryList
        histories={histories}
        onDeleteHistory={(historyId) => {
          setHistories((prev) => prev.filter((h) => h.id !== historyId))
        }}
        onUpdateHistory={(updated) => {
          if (!updated?.id) return
          setHistories((prev) => prev.map((h) => (h.id === updated.id ? { ...h, ...updated } : h)))
        }}
      />
      {loading && <HistoriesLoading />}
    </div>
  )
})

export default Following
