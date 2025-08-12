import { makeAutoObservable } from 'mobx'
import { apiRequest } from '../utils/apiUtils'
import { refreshToken } from '../services/authService'
import { getCurrentUser } from '../services/userService'

/**
 * AuthStore
 * - Отвечает за аутентификацию и текущего пользователя
 * - Сохраняет пользователя в localStorage для персистентности
 * - Умеет обновлять токен и подтягивать пользователя (`tryRefreshToken`)
 */
class AuthStore {
  user = null

  constructor() {
    makeAutoObservable(this)
    this.initializeAuth()
  }

  initializeAuth() {
    const savedUser = localStorage.getItem('user')
    
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser)
      } catch (e) {
        this.clearAuth()
      }
    }
  }

  setUser(user) {
    this.user = user
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('user_id')
    }
  }

  clearAuth() {
    localStorage.removeItem('user')
    this.user = null
  }

  async logout() {
    try {
      apiRequest("/auth/logout/", {method: "POST", json: false})
    } catch (e) {}
    this.clearAuth()
  }

  get isAuthenticated() {
    const result = !!this.user
    return result
  }

  async tryRefreshToken() {
    try {
      await refreshToken()

      const user = await getCurrentUser()
      this.setUser(user)
      return true
    } catch (e) {
      this.clearAuth()
      return false
    }
  }

}

const authStore = new AuthStore()
export default authStore 
