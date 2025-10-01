import React, { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserById } from '../services/userService'
import { useStore } from '../stores/StoreContext'

const ProfileModalContext = createContext({})

export const ProfileModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    open: false,
    user: null,
    loading: false,
    error: null
  })
  const navigate = useNavigate()
  const { auth } = useStore()

  const openProfileModal = useCallback(async (userId) => {
    if (!userId) return
    
    setModalState({ open: true, user: null, loading: true, error: null })
    try {
      const user = await getUserById(userId)
      setModalState({ open: true, user, loading: false, error: null })
    } catch (error) {
      setModalState({ open: true, user: null, loading: false, error: error.message })
    }
  }, [])

  const closeProfileModal = useCallback(() => {
    setModalState({ open: false, user: null, loading: false, error: null })
  }, [])

  const handleGoToChat = useCallback(() => {
    const userId = modalState.user?.user_info?.id || modalState.user?.id
    if (userId) {
      navigate(`/messenger/${userId}`)
      closeProfileModal()
    }
  }, [modalState.user, navigate, closeProfileModal])

  const handleGoToProfile = useCallback(() => {
    const userId = modalState.user?.user_info?.id || modalState.user?.id
    const currentUserId = auth.user?.user_info?.id
    
    if (userId) {
      // Если это профиль текущего пользователя, переходим на /profile/ без ID
      if (currentUserId && userId === currentUserId) {
        navigate('/profile/')
      } else {
        navigate(`/profile/${encodeURIComponent(userId)}`)
      }
      closeProfileModal()
    }
  }, [modalState.user, navigate, closeProfileModal, auth.user])

  const handleGoToFavorites = useCallback(() => {
    navigate('/favorites')
    closeProfileModal()
  }, [navigate, closeProfileModal])

  return (
    <ProfileModalContext.Provider 
      value={{
        modalState,
        openProfileModal,
        closeProfileModal,
        handleGoToChat,
        handleGoToProfile,
        handleGoToFavorites
      }}
    >
      {children}
    </ProfileModalContext.Provider>
  )
}

export const useProfileModal = () => {
  const context = useContext(ProfileModalContext)
  if (!context) {
    throw new Error('useProfileModal must be used within ProfileModalProvider')
  }
  return context
}
