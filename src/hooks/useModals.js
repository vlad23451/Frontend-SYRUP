import { useState, useCallback } from 'react'

export const useModals = () => {
  const [profileModal, setProfileModal] = useState({ open: false, user: null, loading: false, error: null })
  const [commentsModal, setCommentsModal] = useState({ open: false })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleCloseProfileModal = useCallback(() => {
    setProfileModal({ open: false, user: null, loading: false, error: null })
  }, [])

  const handleCloseCommentsModal = useCallback(() => {
    setCommentsModal({ open: false })
  }, [])

  const handleOpenCommentsModal = useCallback(() => {
    setCommentsModal({ open: true })
  }, [])

  const handleOpenProfileModal = useCallback((user, loading = false, error = null) => {
    setProfileModal({ open: true, user, loading, error })
  }, [])

  const handleConfirmRequest = useCallback((confirmData) => {
    setDeleteConfirm(confirmData)
  }, [])

  const handleCloseConfirm = useCallback(() => {
    setDeleteConfirm(null)
  }, [])

  return {
    profileModal,
    commentsModal,
    deleteConfirm,
    handleCloseProfileModal,
    handleCloseCommentsModal,
    handleOpenCommentsModal,
    handleOpenProfileModal,
    handleConfirmRequest,
    handleCloseConfirm
  }
}
