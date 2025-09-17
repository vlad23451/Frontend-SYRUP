import { useState, useEffect } from 'react'
import { useStore } from '../stores/StoreContext'
import { 
  createHistoryLike, 
  deleteHistoryLike, 
  createHistoryDislike, 
  deleteHistoryDislike 
} from '../services/historyService'

export const useHistoryReactions = (history) => {
  const { auth } = useStore()
  const [isLikeActive, setIsLikeActive] = useState(false)
  const [isDislikeActive, setIsDislikeActive] = useState(false)
  const [likeCount, setLikeCount] = useState(history.likes || 0)
  const [dislikeCount, setDislikeCount] = useState(history.dislikes || 0)
  const [loadingReactions, setLoadingReactions] = useState(new Set())

  // Инициализация состояний из данных истории
  useEffect(() => {
    const currentUserLiked = history.liked_users?.some(user => user.follow_status === 'me') || false
    const currentUserDisliked = history.disliked_users?.some(user => user.follow_status === 'me') || false
    
    setIsLikeActive(currentUserLiked)
    setIsDislikeActive(currentUserDisliked)
    setLikeCount(history.likes || 0)
    setDislikeCount(history.dislikes || 0)
  }, [history])

  const handleToggleLike = async () => {
    if (!auth?.user) return
    
    // Проверяем, не выполняется ли уже запрос для этой истории
    if (loadingReactions.has('like')) return
    
    // Добавляем в набор загружающихся реакций
    setLoadingReactions(prev => new Set(prev).add('like'))
    
    try {
      // Используем prevState для безопасного обновления состояния
      if (isLikeActive) {
        await deleteHistoryLike(history.id)
        setIsLikeActive(prev => false)
        setLikeCount(prev => Math.max(0, prev - 1))
      } else {
        await createHistoryLike(history.id)
        setIsLikeActive(prev => true)
        setLikeCount(prev => prev + 1)
        
        // Если был активен дизлайк, убираем его
        if (isDislikeActive) {
          await deleteHistoryDislike(history.id)
          setIsDislikeActive(prev => false)
          setDislikeCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (err) {
      console.error('Ошибка при работе с лайком истории:', err)
    } finally {
      // Убираем из набора загружающихся реакций
      setLoadingReactions(prev => {
        const newSet = new Set(prev)
        newSet.delete('like')
        return newSet
      })
    }
  }

  const handleToggleDislike = async () => {
    if (!auth?.user) return
    
    // Проверяем, не выполняется ли уже запрос для этой истории
    if (loadingReactions.has('dislike')) return
    
    // Добавляем в набор загружающихся реакций
    setLoadingReactions(prev => new Set(prev).add('dislike'))
    
    try {
      // Используем prevState для безопасного обновления состояния
      if (isDislikeActive) {
        await deleteHistoryDislike(history.id)
        setIsDislikeActive(prev => false)
        setDislikeCount(prev => Math.max(0, prev - 1))
      } else {
        await createHistoryDislike(history.id)
        setIsDislikeActive(prev => true)
        setDislikeCount(prev => prev + 1)
        
        // Если был активен лайк, убираем его
        if (isLikeActive) {
          await deleteHistoryLike(history.id)
          setIsLikeActive(prev => false)
          setLikeCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (err) {
      console.error('Ошибка при работе с дизлайком истории:', err)
    } finally {
      // Убираем из набора загружающихся реакций
      setLoadingReactions(prev => {
        const newSet = new Set(prev)
        newSet.delete('dislike')
        return newSet
      })
    }
  }

  return {
    isLikeActive,
    isDislikeActive,
    likeCount,
    dislikeCount,
    loadingReactions,
    handleToggleLike,
    handleToggleDislike,
    isAuthenticated: !!auth?.user
  }
}
