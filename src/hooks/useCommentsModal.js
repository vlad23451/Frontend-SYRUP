import { useState, useCallback } from 'react'

export const useCommentsModal = () => {
  const [commentsModal, setCommentsModal] = useState({ open: false })

  const handleOpenCommentsModal = useCallback(() => {
    setCommentsModal({ open: true })
  }, [])

  const handleCloseCommentsModal = useCallback(() => {
    setCommentsModal({ open: false })
  }, [])

  return {
    commentsModal,
    handleOpenCommentsModal,
    handleCloseCommentsModal
  }
}
