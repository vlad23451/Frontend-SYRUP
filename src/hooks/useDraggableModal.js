import { useEffect } from 'react'

/**
 * useDraggableModal
 * - Делает модалки перетаскиваемыми за "ручку" (handleRef)
 * - Ограничивает перемещение границами вьюпорта
 * - Не изменяет DOM, если модалка закрыта или refs не готовы
 */
export function useDraggableModal(open, containerRef, handleRef) {
  useEffect(() => {
    const handle = handleRef.current
    const container = containerRef.current
    if (!open || !handle || !container) return

    let isDragging = false
    let startX = 0, startY = 0
    let startLeft = 0, startTop = 0

    const onDown = (e) => {
      isDragging = true
      handle.setPointerCapture(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      const rect = container.getBoundingClientRect()
      startLeft = rect.left
      startTop = rect.top
      handle.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const vw = window.innerWidth
      const vh = window.innerHeight
      const rect = container.getBoundingClientRect()
      const newLeft = Math.max(8, Math.min(vw - rect.width - 8, startLeft + dx))
      const newTop = Math.max(8, Math.min(vh - rect.height - 8, startTop + dy))
      container.style.left = newLeft + 'px'
      container.style.top = newTop + 'px'
      container.style.position = 'fixed'
      container.style.margin = '0'
      container.style.transform = 'none'
    }
    const onUp = (e) => {
      isDragging = false
      try { handle.releasePointerCapture(e.pointerId) } catch {}
      handle.style.cursor = 'grab'
    }
    handle.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      handle.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [open, containerRef, handleRef])
}


