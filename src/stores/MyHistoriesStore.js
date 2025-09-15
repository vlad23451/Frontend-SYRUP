import { makeAutoObservable, runInAction } from 'mobx'
import { getMyHistories } from '../services/historyService'

class MyHistoriesStore {
  items = []
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

  setItems(items) {
    this.items = items
  }

  removeById(historyId) {
    this.items = this.items.filter((h) => h.id !== historyId)
  }

  updateItem(updatedHistory) {
    if (!updatedHistory || !updatedHistory.id) return
    this.items = this.items.map(
      (h) => (h.id === updatedHistory.id ? { ...h, ...updatedHistory } : h)
    )
  }

  async fetchMyHistories() {
    this.setLoading(true)
    this.setError(null)
    
    try {
      const data = await getMyHistories()
      runInAction(() => {
        this.items = data
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

export default new MyHistoriesStore() 
