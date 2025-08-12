import { useState, useEffect } from 'react'

export const useHistoryComments = (history) => {
  const [commentCount, setCommentCount] = useState(history.comments || 0)

  useEffect(() => {
    setCommentCount(history.comments || 0)
  }, [history.comments])

  const updateCommentCount = (newCount) => {
    setCommentCount(newCount)
  }

  return {
    commentCount,
    updateCommentCount
  }
}
