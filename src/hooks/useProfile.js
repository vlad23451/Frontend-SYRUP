import { useState, useCallback } from 'react'
import { useStore } from '../stores/StoreContext'
import { getUserById } from '../services/userService'

export const useProfile = () => {
  const { auth } = useStore()
  const [profileModal, setProfileModal] = useState({ open: false, user: null, loading: false, error: null })

  const currentUserId = auth?.user?.id
  const myLogin = auth?.user?.login || 'Вы'
  const myAvatar = auth?.user?.avatar

  const getAuthorInfo = (history, options = {}) => {
    const { 
      forceMeAsAuthor = false,
      overrideAuthorId,
      overrideAuthorLogin,
      overrideAuthorAvatar
    } = options

    if (forceMeAsAuthor) {
      const displayLogin = 'Вы'
      const fallbackName = myLogin || 'Вы'
      const displayAvatar = myAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`
      const targetUserId = currentUserId

      return {
        displayLogin,
        displayAvatar,
        targetUserId,
        isMeAuthor: true
      }
    }

    const authorId = overrideAuthorId ?? history.author?.id
    const authorLogin = (overrideAuthorLogin ?? history.author?.login) || 'Автор'
    const authorAvatar = overrideAuthorAvatar ?? history.author?.avatar

    const isMeAuthor = authorId && currentUserId && authorId === currentUserId
    const displayLogin = isMeAuthor ? 'Вы' : authorLogin
    const displayAvatar = authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorLogin)}&background=random`
    const targetUserId = isMeAuthor ? currentUserId : authorId

    return {
      displayLogin,
      displayAvatar,
      targetUserId,
      isMeAuthor
    }
  }

  const handleProfileClick = useCallback(async (targetUserId) => {
    if (!targetUserId) return
    
    setProfileModal({ open: true, user: null, loading: true, error: null })
    try {
      const user = await getUserById(targetUserId)
      setProfileModal({ open: true, user: user, loading: false, error: null })
    } catch (error) {
      setProfileModal({ open: true, user: null, loading: false, error: error.message })
    }
  }, [])

  const handleCloseProfileModal = useCallback(() => {
    setProfileModal({ open: false, user: null, loading: false, error: null })
  }, [])

  return {
    profileModal,
    currentUserId,
    myLogin,
    myAvatar,
    getAuthorInfo,
    handleProfileClick,
    handleCloseProfileModal
  }
}
