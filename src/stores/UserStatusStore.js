import { makeAutoObservable, runInAction } from 'mobx'

class UserStatusStore {
  userStatuses = new Map() // userId -> { is_online, last_seen, timestamp }

  constructor() {
    makeAutoObservable(this)
  }

  updateUserStatus(userId, statusData) {
    const { is_online, last_seen, timestamp } = statusData
    
    runInAction(() => {
      this.userStatuses.set(userId, {
        is_online,
        last_seen,
        timestamp,
        updated_at: new Date().toISOString()
      })
    })
  }

  getUserStatus(userId) {
    return this.userStatuses.get(userId) || {
      is_online: false,
      last_seen: null,
      timestamp: null
    }
  }

  isUserOnline(userId) {
    const status = this.getUserStatus(userId)
    return status.is_online
  }

  getUserLastSeen(userId) {
    const status = this.getUserStatus(userId)
    return status.last_seen
  }

  clearAllStatuses() {
    runInAction(() => {
      this.userStatuses.clear()
    })
  }
}

const userStatusStore = new UserStatusStore()

export default userStatusStore
