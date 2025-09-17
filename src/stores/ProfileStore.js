import { makeAutoObservable, runInAction } from 'mobx'
import { getCurrentUser } from '../services/userService'

class ProfileStore {
  user = null
  loading = false
  error = null

  constructor() {
    makeAutoObservable(this)
  }

  setLoading(loading) {
    this.loading = loading
  }

  setError(error) {
    this.error = error
  }

  setUser(user) {
    this.user = user
  }

  updateUserCounters(followersDelta, followingDelta) {
    if (this.user) {
      runInAction(() => {
        this.user.followers = Math.max(0, (this.user.followers || 0) + followersDelta)
        this.user.following = Math.max(0, (this.user.following || 0) + followingDelta)
      })
    }
  }

  async fetchProfile() {
    this.setLoading(true)
    this.setError(null)
    
    try {
      const data = await getCurrentUser()
      
      const normalizedData = {
        ...data,
        avatar_key: data?.avatar_key || data?.user_info?.avatar_key
      }

      runInAction(() => {
        this.user = normalizedData
        this.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }
}

export default new ProfileStore() 
