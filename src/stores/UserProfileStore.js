import { makeAutoObservable, runInAction } from 'mobx'
import { getUserById } from '../services/userService'
import { getUserHistories } from '../services/historyService'

class UserProfileStore {
  user = null
  histories = []
  loading = false
  error = null
  historiesLoading = false
  historiesError = null

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

  setHistoriesLoading(loading) {
    this.historiesLoading = loading
  }

  setHistoriesError(error) {
    this.historiesError = error
  }

  setHistories(items) {
    this.histories = items
  }

  updateUserCounters(followersDelta, followingDelta) {
    if (this.user) {
      runInAction(() => {
        this.user.followers = Math.max(0, (this.user.followers || 0) + followersDelta)
        this.user.following = Math.max(0, (this.user.following || 0) + followingDelta)
      })
    }
  }

  async fetchUser(userId) {
    this.setLoading(true)
    this.setError(null)

    try {
      const data = await getUserById(userId)
      runInAction(() => {
        this.user = data
        this.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }

  async fetchUserHistories(userId) {
    this.setHistoriesLoading(true)
    this.setHistoriesError(null)
    
    try {
      const items = await getUserHistories(userId)
      runInAction(() => {
        this.histories = items
        this.historiesLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.historiesError = error.message
        this.historiesLoading = false
      })
    }
  }
}

export default new UserProfileStore()

