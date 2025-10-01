import { useStore } from '../stores/StoreContext'
import { getUserInfo } from '../utils/localStorageUtils'

export const useProfile = () => {
  const { auth } = useStore()
  
  // Получаем данные из localStorage как fallback, если данные в сторе не актуальны
  const userInfo = getUserInfo()
  
  const currentUserId = auth.user?.user_info?.id || userInfo?.id
  const myLogin = auth.user?.user_info?.login || userInfo?.login
  // Принудительно используем аватарку из стора, если она есть
  const myAvatarUrl = auth.user?.user_info?.avatar_url || userInfo?.avatar_url 

  const getAuthorInfo = (history, options = {}) => {
    const { 
      forceMeAsAuthor = false,
      overrideAuthorId,
      overrideAuthorLogin,
      overrideAuthorAvatar
    } = options

    if (forceMeAsAuthor) {
      const displayLogin = myLogin
      const fallbackName = myLogin
      // Принудительно используем аватарку из стора, если она есть
      const displayAvatar = auth.user?.user_info?.avatar_url || myAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`
      const targetUserId = currentUserId

      return {
        displayLogin,
        displayAvatar,
        targetUserId,
        isMeAuthor: true
      }
    }

    const authorId = overrideAuthorId ?? history.author?.id
    const authorLogin = overrideAuthorLogin ?? history.author?.login
    const authorAvatar = overrideAuthorAvatar ?? history.author?.avatar_url

    const isMeAuthor = authorId && currentUserId && authorId === currentUserId
    const displayLogin = authorLogin
    const displayAvatar = authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayLogin)}&background=random`
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
    myAvatarUrl,
    getAuthorInfo
  }
}
