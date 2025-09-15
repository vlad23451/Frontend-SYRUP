import { makeAutoObservable, runInAction } from 'mobx'
import { getHistoriesByIds } from '../services/historyService'

/**
 * HistoriesViewStore - управление состоянием просмотра главной ленты историй
 * 
 * Основные возможности:
 * - Кэширование списка историй и позиции пагинации
 * - Отслеживание просмотренных ID (с ограничением размера)
 * - Якорное восстановление по topId + offsetRatio
 * - Дедупликация при дозагрузке новых страниц
 */
class HistoriesViewStore {
  // Кэш текущего списка историй
  histories = []
  
  // Состояние пагинации
  page = 0
  hasMore = true
  loading = false
  error = null
  
  // Логика просмотренных/отрендеренных ID упрощена
  viewedIds = new Set()
  renderedIds = new Set()
  
  // Якорь для восстановления позиции
  anchor = {
    topId: null,
    offsetRatio: 0
  }
  
  // Срез видимых ID (2-3 элемента)
  visibleSlice = []
  
  // Счетчик пустых страниц не используется (временно отключён)
  // emptyPagesCount = 0
  
  // Конфигурация
  MAX_VIEWED_IDS = 5000
  
  constructor() {
    makeAutoObservable(this)
  }
  
  // === Управление состоянием загрузки ===
  
  setLoading(loading) {
    this.loading = loading
  }
  
  setError(error) {
    this.error = error
  }
  
  setPage(page) {
    this.page = page
  }
  
  setHasMore(hasMore) {
    this.hasMore = hasMore
  }
  
  // === Управление счетчиком пустых страниц ===
  
  incrementEmptyPages() {
    this.emptyPagesCount++
  }
  
  resetEmptyPages() {
    this.emptyPagesCount = 0
  }
  
  // === Управление списком историй ===
  
  setHistories(histories) {
    console.log('💾 setHistories called with', histories.length, 'items')
    this.histories = histories
    this.markRendered(histories.map(h => h.id))
  }
  
  appendHistories(newHistories) {
    this.histories = [...this.histories, ...newHistories]
  }
  
  // Удаление истории (при удалении пользователем)
  removeHistory(historyId) {
    this.histories = this.histories.filter(h => h.id !== historyId)
    this.renderedIds.delete(historyId)
    // viewedIds оставляем, чтобы не показывать удаленную историю снова
  }
  
  // Обновление истории (при редактировании)
  updateHistory(updatedHistory) {
    if (!updatedHistory?.id) return
    this.histories = this.histories.map(h => 
      h.id === updatedHistory.id ? { ...h, ...updatedHistory } : h
    )
  }
  
  // === Фильтрация и дедупликация ===
  
  filterNewItems(items) {
    return items // дедупликация отключена
  }
  
  // === Управление просмотренными и отрендеренными ID ===
  
  markViewed(ids) {
    ids.forEach(id => this.viewedIds.add(id))
    this.trimViewedIds()
  }
  
  markRendered(ids) {
    ids.forEach(id => this.renderedIds.add(id))
  }
  
  // Ограничение размера viewedIds
  trimViewedIds() {
    if (this.viewedIds.size > this.MAX_VIEWED_IDS) {
      const idsArray = Array.from(this.viewedIds)
      const toRemove = idsArray.slice(0, idsArray.length - this.MAX_VIEWED_IDS)
      toRemove.forEach(id => this.viewedIds.delete(id))
    }
  }
  
  // === Якорное позиционирование ===
  
  setAnchor(topId, offsetRatio, visibleSlice = []) {
    this.anchor = { topId, offsetRatio }
    this.visibleSlice = visibleSlice.slice(0, 3) // Ограничиваем до 3 элементов
  }
  
  // Проверка, есть ли якорь в текущем списке
  hasAnchorInList() {
    return this.anchor.topId && this.histories.some(h => h.id === this.anchor.topId)
  }
  
  // Поиск ближайшего ID из visibleSlice
  findClosestFromSlice() {
    for (const id of this.visibleSlice) {
      if (this.histories.some(h => h.id === id)) {
        return id
      }
    }
    return null
  }
  
  // Получение якорной истории по ID через API
  async fetchAnchorHistory() {
    if (!this.anchor.topId) return null
    
    try {
      const histories = await getHistoriesByIds([this.anchor.topId])
      return histories.length > 0 ? histories[0] : null
    } catch (error) {
      console.warn('Failed to fetch anchor history:', error)
      return null
    }
  }
  
  // Получение историй из visibleSlice через API
  async fetchVisibleSliceHistories() {
    if (this.visibleSlice.length === 0) return []
    
    try {
      const histories = await getHistoriesByIds(this.visibleSlice)
      return histories || []
    } catch (error) {
      console.warn('Failed to fetch visible slice histories:', error)
      return []
    }
  }
  
  // === Сброс состояния ===
  
  clear() {
    console.log('🧹 Clearing store (keeping viewedIds)')
    this.histories = []
    this.page = 0
    this.hasMore = true
    this.loading = false
    this.error = null
    this.anchor = { topId: null, offsetRatio: 0 }
    this.visibleSlice = []
    // viewedIds и renderedIds НЕ сбрасываем при обычном clear
  }
  
  // Полный сброс (включая просмотренные ID)
  reset() {
    console.log('🗑️ FULL RESET - clearing everything including viewedIds')
    this.clear()
    this.viewedIds.clear()
    this.renderedIds.clear()
  }
  
  // Вставка якорной истории в начало списка (для восстановления)
  insertAnchorHistory(anchorHistory) {
    if (!anchorHistory || this.histories.some(h => h.id === anchorHistory.id)) {
      return // Уже есть в списке
    }
    
    this.histories = [anchorHistory, ...this.histories]
    this.markRendered([anchorHistory.id])
  }
  
  // === Snapshot для sessionStorage (опционально) ===
  
  createSnapshot() {
    return {
      histories: this.histories,
      page: this.page,
      hasMore: this.hasMore,
      anchor: this.anchor,
      visibleSlice: this.visibleSlice,
      viewedIds: Array.from(this.viewedIds),
      renderedIds: Array.from(this.renderedIds)
    }
  }
  
  restoreFromSnapshot(snapshot) {
    runInAction(() => {
      this.histories = snapshot.histories || []
      this.page = snapshot.page || 0
      this.hasMore = snapshot.hasMore !== false
      this.anchor = snapshot.anchor || { topId: null, offsetRatio: 0 }
      this.visibleSlice = snapshot.visibleSlice || []
      this.viewedIds = new Set(snapshot.viewedIds || [])
      this.renderedIds = new Set(snapshot.renderedIds || [])
    })
  }
  
  // === Вычисляемые свойства ===
  
  get isEmpty() {
    return this.histories.length === 0
  }
  
  get hasAnchor() {
    return this.anchor.topId !== null
  }
  
  get viewedCount() {
    return this.viewedIds.size
  }
  
  get hasValidAnchor() {
    return this.anchor.topId !== null && this.anchor.topId !== undefined
  }
}

export default new HistoriesViewStore()
