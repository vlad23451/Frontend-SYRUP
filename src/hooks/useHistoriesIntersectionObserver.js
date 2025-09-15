import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../stores/StoreContext'

/**
 * Хук для отслеживания видимых историй с помощью IntersectionObserver
 * 
 * Отслеживает какие карточки историй находятся в viewport и:
 * - Определяет верхнюю видимую историю (anchor)
 * - Вычисляет offsetRatio для точного восстановления позиции
 * - Помечает видимые истории как просмотренные
 * - Сохраняет срез видимых ID
 */
export const useHistoriesIntersectionObserver = () => {
  const { historiesView } = useStore()
  const observerRef = useRef(null)
  const updateTimeoutRef = useRef(null)
  
  const handleIntersection = useCallback((entries) => {
    // Получаем все видимые элементы с их позициями
    const visibleElements = entries
      .filter(entry => entry.isIntersecting)
      .map(entry => {
        const id = parseInt(entry.target.dataset.id, 10)
        const rect = entry.boundingClientRect
        return {
          id,
          top: rect.top,
          bottom: rect.bottom,
          element: entry.target
        }
      })
      .filter(item => !isNaN(item.id))
      .sort((a, b) => a.top - b.top)
    
    if (visibleElements.length === 0) return
    
    // Определяем верхний видимый элемент (anchor)
    const topElement = visibleElements[0]
    
    // Вычисляем offsetRatio - насколько элемент "скрыт" за верхней границей viewport
    const offsetRatio = Math.min(
      Math.max((0 - topElement.top) / window.innerHeight, 0), 
      1
    )
    
    // Формируем срез видимых ID (первые 2-3)
    const visibleSlice = visibleElements
      .slice(0, 3)
      .map(el => el.id)
    
    // Обновляем стор
    historiesView.setAnchor(topElement.id, offsetRatio, visibleSlice)
    
    // Помечаем видимые истории как просмотренные
    const visibleIds = visibleElements.map(el => el.id)
    historiesView.markViewed(visibleIds)
  }, [historiesView])
  
  useEffect(() => {
    // Создаем IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        // Throttling обновлений (100ms)
        if (updateTimeoutRef.current) return
        
        updateTimeoutRef.current = setTimeout(() => {
          updateTimeoutRef.current = null
          handleIntersection(entries)
        }, 100)
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: [0, 0.1, 0.5, 0.9] // Множественные пороги для точности
      }
    )
    
    observerRef.current = observer
    
    // Находим все существующие карточки и начинаем их отслеживать
    const cards = document.querySelectorAll('.history-card-anchor[data-id]')
    cards.forEach(card => observer.observe(card))
    
    // Cleanup
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      observer.disconnect()
    }
  }, [handleIntersection])
  
  // Метод для добавления новых карточек к отслеживанию
  const observeNewCards = () => {
    if (!observerRef.current) return
    
    // Находим карточки, которые еще не отслеживаются
    const allCards = document.querySelectorAll('.history-card-anchor[data-id]')
    allCards.forEach(card => {
      // IntersectionObserver автоматически игнорирует уже отслеживаемые элементы
      observerRef.current.observe(card)
    })
  }
  
  return {
    observeNewCards
  }
}
