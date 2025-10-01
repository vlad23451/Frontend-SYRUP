/**
 * @fileoverview Контекст для управления просмотрами историй
 * 
 * Глобальный контекст для отслеживания просмотров историй с пакетной отправкой.
 * Обеспечивает единое состояние для всех компонентов истории.
 */

import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react'
import { addHistoryViewsBulk } from '../services/historyService'

const HistoryViewsContext = createContext({})

export const HistoryViewsProvider = ({ children }) => {
  const viewedHistories = useRef(new Set())
  const viewsToSend = useRef([])
  const observerRef = useRef(null)
  const BATCH_SIZE = 20


  const sendBulkViews = useCallback(async (historyIds) => {
    if (historyIds.length === 0) {
      return
    }

    try {
      await addHistoryViewsBulk(historyIds)
      // Добавляем все ID в просмотренные
      historyIds.forEach(id => viewedHistories.current.add(id))
    } catch (error) {
      console.error('Ошибка отправки пакета просмотров:', error)
      // В случае ошибки не добавляем в просмотренные, чтобы можно было повторить попытку
    }
  }, [])

  const trackView = useCallback((historyId) => {
    // Проверяем, не просматривали ли мы уже эту историю
    if (viewedHistories.current.has(historyId)) {
      return
    }

    // Проверяем, не добавляли ли мы уже эту историю в очередь
    if (viewsToSend.current.includes(historyId)) {
      return
    }

    // Добавляем в очередь на отправку
    viewsToSend.current.push(historyId)

    // Если накопилось достаточно просмотров, отправляем пакет
    if (viewsToSend.current.length >= BATCH_SIZE) {
      const idsToSend = [...viewsToSend.current]
      viewsToSend.current = []
      
      // Отправляем асинхронно
      sendBulkViews(idsToSend)
    }
  }, [sendBulkViews])

  const createObserver = useCallback(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null
    }

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const historyId = entry.target.getAttribute('data-history-id')
          
          if (entry.isIntersecting && historyId) {
            trackView(parseInt(historyId))
          }
        })
      },
      {
        // Считаем историю просмотренной, когда она видна на 50% или больше
        threshold: 0.5,
        // Начинаем отслеживать, когда история появляется в области видимости
        rootMargin: '0px'
      }
    )
  }, [trackView])

  const observeElement = useCallback((element) => {
    if (!element) {
      return
    }

    if (!observerRef.current) {
      observerRef.current = createObserver()
    }

    if (observerRef.current) {
      observerRef.current.observe(element)
    }
  }, [createObserver])

  const unobserveElement = useCallback((element) => {
    if (!element || !observerRef.current) return

    observerRef.current.unobserve(element)
  }, [])

  const flushPendingViews = useCallback(async () => {
    if (viewsToSend.current.length > 0) {
      const idsToSend = [...viewsToSend.current]
      viewsToSend.current = []
      
      // Отправляем оставшиеся просмотры
      await sendBulkViews(idsToSend)
    }
  }, [sendBulkViews])

  const resetViewedHistories = useCallback(() => {
    viewedHistories.current.clear()
    viewsToSend.current = []
  }, [])


  // Очищаем observer и отправляем оставшиеся просмотры при размонтировании
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      // Отправляем оставшиеся просмотры
      flushPendingViews()
    }
  }, [flushPendingViews])

  return (
    <HistoryViewsContext.Provider 
      value={{
        trackView,
        observeElement,
        unobserveElement,
        flushPendingViews,
        resetViewedHistories
      }}
    >
      {children}
    </HistoryViewsContext.Provider>
  )
}

export const useHistoryViews = () => {
  const context = useContext(HistoryViewsContext)
  if (!context) {
    throw new Error('useHistoryViews must be used within HistoryViewsProvider')
  }
  return context
}
