export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user')
    if (!userData) return null
    
    return JSON.parse(userData)
  } catch (error) {
    console.error('Ошибка получения данных пользователя из localStorage:', error)
    return null
  }
}

export const getUserId = () => {
  const user = getUserFromStorage()
  return user.user_info.id
}

export const getUserLogin = () => {
  const user = getUserFromStorage()
  return user.user_info.login
}

export const getUserAvatarUrl = () => {
  const user = getUserFromStorage()
  return user.user_info.avatar_url
}

export const getUserInfo = () => {
  const user = getUserFromStorage()
  return user.user_info
}

export const isUserAuthenticated = () => {
  const user = getUserFromStorage()
  return !!(user.user_info.id)
}

export const saveUserToStorage = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData))
  } catch (error) {
    console.error('Ошибка сохранения данных пользователя в localStorage:', error)
  }
}

export const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Ошибка очистки данных пользователя из localStorage:', error)
  }
}
