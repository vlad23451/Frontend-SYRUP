/**
 * @fileoverview Страница для просмотра отдельной истории
 * 
 * Позволяет просматривать конкретную историю по ID через URL вида /history/{id}
 * Используется для шаринга историй и прямого доступа к ним.
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getHistoryById } from '../services/historyService'
import HistoryCard from '../components/histories/HistoryCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const HistoryView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadHistory = async () => {
      if (!id) {
        setError('ID истории не указан')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const historyData = await getHistoryById(id)
        setHistory(historyData)
      } catch (err) {
        console.error('Ошибка загрузки истории:', err)
        setError(err.message || 'История не найдена')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [id])

  const handleBackToFeed = () => {
    navigate('/')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="history-view-error">
          <h2>История не найдена</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={handleBackToFeed}
          >
            Вернуться к ленте
          </button>
        </div>
      </div>
    )
  }

  if (!history) {
    return (
      <div className="page-container">
        <div className="history-view-error">
          <h2>История не найдена</h2>
          <p>История с ID {id} не существует</p>
          <button 
            className="btn btn-primary"
            onClick={handleBackToFeed}
          >
            Вернуться к ленте
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="history-view-container">
        <div className="history-view-header">
          <button 
            className="btn btn-secondary"
            onClick={handleBackToFeed}
          >
            ← Вернуться к ленте
          </button>
        </div>
        
        <div className="history-view-content">
          <HistoryCard 
            history={history}
            onDelete={(deletedHistory) => {
              // После удаления истории перенаправляем на главную
              navigate('/')
            }}
            onUpdate={(updatedHistory) => {
              setHistory(updatedHistory)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default HistoryView
