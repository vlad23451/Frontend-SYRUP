import { useStore } from '../stores/StoreContext'

export const useProfile = () => {
  const { auth } = useStore()

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

  return {
    currentUserId,
    myLogin,
    myAvatar,
    getAuthorInfo
  }
}
