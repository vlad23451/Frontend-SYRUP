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
    
    try {
      if (isLikeActive) {
        await deleteHistoryLike(history.id)
        setIsLikeActive(false)
        setLikeCount((c) => Math.max(0, c - 1))
      } else {
        await createHistoryLike(history.id)
        setIsLikeActive(true)
        setLikeCount((c) => c + 1)
        
        if (isDislikeActive) {
          await deleteHistoryDislike(history.id)
          setIsDislikeActive(false)
          setDislikeCount((c) => Math.max(0, c - 1))
        }
      }
    } catch (err) {
      console.error('Ошибка при работе с лайком истории:', err)
    }
  }

  const handleToggleDislike = async () => {
    if (!auth?.user) return
    
    try {
      if (isDislikeActive) {
        await deleteHistoryDislike(history.id)
        setIsDislikeActive(false)
        setDislikeCount((c) => Math.max(0, c - 1))
      } else {
        await createHistoryDislike(history.id)
        setIsDislikeActive(true)
        setDislikeCount((c) => c + 1)
        
        if (isLikeActive) {
          await deleteHistoryLike(history.id)
          setIsLikeActive(false)
          setLikeCount((c) => Math.max(0, c - 1))
        }
      }
    } catch (err) {
      console.error('Ошибка при работе с дизлайком истории:', err)
    }
  }

  return {
    isLikeActive,
    isDislikeActive,
    likeCount,
    dislikeCount,
    handleToggleLike,
    handleToggleDislike,
    isAuthenticated: !!auth?.user
  }
}
