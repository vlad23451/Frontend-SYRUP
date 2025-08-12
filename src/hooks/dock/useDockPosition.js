import React, { useEffect, useMemo, useRef, useState } from 'react'

export const useDockPosition = () => {
  const dockRef = useRef(null)
  const innerRef = useRef(null)
  const handleRef = useRef(null)

  const [edge, setEdge] = useState(() => localStorage.getItem('dock-edge') || 'bottom')
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('dock-free-pos')
    return saved ? JSON.parse(saved) : { x: null, y: null }
  })

  useEffect(() => {
    localStorage.setItem('dock-free-pos', JSON.stringify(position))
  }, [position])

  const computeEdgePosition = React.useCallback((edgeValue) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const defaultOffset = 18
    if (edgeValue === 'top') return { x: Math.round(vw / 2), y: defaultOffset, anchor: 'top' }
    if (edgeValue === 'bottom') return { x: Math.round(vw / 2), y: vh - defaultOffset, anchor: 'bottom' }
    if (edgeValue === 'left') return { x: defaultOffset, y: Math.round(vh / 2), anchor: 'left' }
    if (edgeValue === 'right') return { x: vw - defaultOffset, y: Math.round(vh / 2), anchor: 'right' }
    return { x: Math.round(vw / 2), y: defaultOffset, anchor: 'top' }
  }, [])

  useEffect(() => {
    if (position.x == null || position.y == null) {
      const pos = computeEdgePosition(edge)
      if (edge === 'top' || edge === 'bottom') setPosition({ x: null, y: pos.y })
      else setPosition({ x: pos.x, y: null })
    }
  }, [])

  useEffect(() => {
    const onEdgeChanged = (e) => {
      const newEdge = e?.detail?.position || localStorage.getItem('dock-edge') || 'bottom'
      setEdge(newEdge)
      if (newEdge === 'top') setPosition({ x: null, y: 18 })
      if (newEdge === 'bottom') setPosition({ x: null, y: window.innerHeight - 18 })
      if (newEdge === 'left') setPosition({ x: 18, y: null })
      if (newEdge === 'right') setPosition({ x: window.innerWidth - 18, y: null })
    }
    window.addEventListener('dock-edge-changed', onEdgeChanged)
    return () => window.removeEventListener('dock-edge-changed', onEdgeChanged)
  }, [])

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    let isDragging = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0

    const onPointerDown = (e) => {
      isDragging = true
      handle.setPointerCapture(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      const rect = (innerRef.current || handle).getBoundingClientRect()
      startLeft = rect.left
      startTop = rect.top
      handle.style.cursor = 'grabbing'
    }

    const onPointerMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const newLeft = startLeft + dx
      const newTop = startTop + dy
      const vw = window.innerWidth
      const vh = window.innerHeight
      const rect = (innerRef.current || handle).getBoundingClientRect()
      const clampedLeft = Math.max(8, Math.min(vw - rect.width - 8, newLeft))
      const clampedTop = Math.max(8, Math.min(vh - rect.height - 8, newTop))
      setPosition({ x: clampedLeft, y: clampedTop })
    }

    const onPointerUp = (e) => {
      isDragging = false
      try { handle.releasePointerCapture(e.pointerId) } catch {}
      handle.style.cursor = 'grab'
      const snapEnabled = (localStorage.getItem('dock-snap') ?? 'true') === 'true'
      const elRect = (innerRef.current || handle).getBoundingClientRect()
      if (!snapEnabled) {
        setPosition({ x: Math.round(elRect.left), y: Math.round(elRect.top) })
        return
      }
      const modalEl = document.querySelector('.custom-modal')
      const overlapsModal = (() => {
        if (!modalEl) return false
        const mr = modalEl.getBoundingClientRect()
        const horiz = elRect.left < mr.right && elRect.right > mr.left
        const vert = elRect.top < mr.bottom && elRect.bottom > mr.top
        return horiz && vert
      })()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const distanceToEdges = {
        left: elRect.left - 8,
        right: (vw - elRect.right) - 8,
        top: elRect.top - 8,
        bottom: (vh - elRect.bottom) - 8,
      }
      const nearest = Object.entries(distanceToEdges).sort((a,b)=>a[1]-b[1])[0]
      const minDistance = Math.min(...Object.values(distanceToEdges))
      if (!overlapsModal && minDistance < 48) {
        let snappedX = elRect.left
        let snappedY = elRect.top
        const nearEdge = nearest[0]
        if (nearEdge === 'left') snappedX = 8
        if (nearEdge === 'right') snappedX = vw - elRect.width - 8
        if (nearEdge === 'top') snappedY = 8
        if (nearEdge === 'bottom') snappedY = vh - elRect.height - 8
        setPosition({ x: Math.round(snappedX), y: Math.round(snappedY) })
      } else {
        setPosition({ x: Math.round(elRect.left), y: Math.round(elRect.top) })
      }
    }

    handle.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      handle.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  const [, setTick] = useState(0)
  useEffect(() => {
    const rerender = () => setTick((t) => t + 1)
    window.addEventListener('settings-section-toggle', rerender)
    return () => window.removeEventListener('settings-section-toggle', rerender)
  }, [])

  useEffect(() => {
    const onReset = () => {
      if (edge === 'top') setPosition({ x: null, y: 18 })
      if (edge === 'bottom') setPosition({ x: null, y: window.innerHeight - 18 })
      if (edge === 'left') setPosition({ x: 18, y: null })
      if (edge === 'right') setPosition({ x: window.innerWidth - 18, y: null })
    }
    window.addEventListener('reset-dock-position', onReset)
    return () => window.removeEventListener('reset-dock-position', onReset)
  }, [edge])

  useEffect(() => {
    const onResize = () => {
      if (edge === 'top' && position.x == null) setPosition({ x: null, y: 18 })
      if (edge === 'bottom' && position.x == null) setPosition({ x: null, y: window.innerHeight - 18 })
      if (edge === 'left' && position.y == null) setPosition({ x: 18, y: null })
      if (edge === 'right' && position.y == null) setPosition({ x: window.innerWidth - 18, y: null })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [edge, position.x, position.y])

  const styleDock = useMemo(() => {
    if (edge === 'top') {
      return position.x == null
        ? { left: '50%', right: 'auto', top: position.y ?? 18, bottom: 'auto', transform: 'translateX(-50%)' }
        : { left: position.x, right: 'auto', top: position.y ?? 18, bottom: 'auto', transform: 'none' }
    }
    if (edge === 'bottom') {
      return position.x == null
        ? { left: '50%', right: 'auto', top: 'auto', bottom: 18, transform: 'translateX(-50%)' }
        : { left: position.x, right: 'auto', top: position.y ?? (window.innerHeight - 18), bottom: 'auto', transform: 'none' }
    }
    if (edge === 'left') {
      return position.y == null
        ? { left: 18, right: 'auto', top: '50%', bottom: 'auto', transform: 'translateY(-50%)' }
        : { left: position.x ?? 18, right: 'auto', top: position.y, bottom: 'auto', transform: 'none' }
    }
    if (edge === 'right') {
      return position.y == null
        ? { left: 'auto', right: 18, top: '50%', bottom: 'auto', transform: 'translateY(-50%)' }
        : { left: position.x ?? (window.innerWidth - 18), right: 'auto', top: position.y, bottom: 'auto', transform: 'none' }
    }
    return { left: '50%', right: 'auto', top: 18, bottom: 'auto', transform: 'translateX(-50%)' }
  }, [edge, position.x, position.y])

  return {
    dockRef,
    innerRef,
    handleRef,
    styleDock,
  }
}


