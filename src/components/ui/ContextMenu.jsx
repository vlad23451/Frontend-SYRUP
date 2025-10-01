import React, { useEffect, useRef, useState } from 'react'

const ContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  children, 
  className = '',
  style = {},
  alignToLeft = false
}) => {
  const menuRef = useRef(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    if (!isOpen) return

    setAdjustedPosition(position)

    if (!menuRef.current) return

    const adjustPosition = () => {
      const menu = menuRef.current
      if (!menu) return

      menu.style.visibility = 'hidden'
      menu.style.display = 'block'
      
      const menuRect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newX = position.x
      let newY = position.y

      if (alignToLeft) {
        newX = position.x - menuRect.width
      }

      if (newX + menuRect.width > viewportWidth) {
        newX = viewportWidth - menuRect.width - 10
      }

      if (newX < 10) {
        newX = 10
      }

      if (newY + menuRect.height > viewportHeight) {
        newY = viewportHeight - menuRect.height - 10
      }

      newY = Math.max(10, newY)

      setAdjustedPosition({ x: newX, y: newY })
      
      menu.style.visibility = 'visible'
    }

    const timeoutId = setTimeout(adjustPosition, 10)

    return () => clearTimeout(timeoutId)
  }, [isOpen, position, alignToLeft])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleScroll = () => {
      onClose()
    }

    const handleResize = () => {
      if (menuRef.current) {
        const menu = menuRef.current
        const menuRect = menu.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let newX = adjustedPosition.x
        let newY = adjustedPosition.y

        if (newX + menuRect.width > viewportWidth) {
          newX = viewportWidth - menuRect.width - 10
        }
        if (newX < 10) {
          newX = 10
        }
        if (newY + menuRect.height > viewportHeight) {
          newY = viewportHeight - menuRect.height - 10
        }

        newY = Math.max(10, newY)

        setAdjustedPosition({ x: newX, y: newY })
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, onClose, adjustedPosition])

  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999998,
        }}
        onClick={onClose}
      />
      
      <div
        ref={menuRef}
        className={`context-menu ${className}`}
        style={{
          position: 'fixed',
          left: adjustedPosition.x,
          top: adjustedPosition.y,
          zIndex: 999999,
          ...style
        }}
      >
        {children}
      </div>
    </>
  )
}

export default ContextMenu
