import { useState, useCallback } from 'react'
import { useGlobalContextMenu } from '../contexts/ContextMenuContext'

export const useContextMenu = (menuId) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { activeMenuId, openMenu: openGlobalMenu, closeMenu: closeGlobalMenu, isMenuOpen } = useGlobalContextMenu()

  const isOpen = isMenuOpen(menuId)

  const openMenu = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    
    setPosition({
      x: event.clientX,
      y: event.clientY
    })

    console.log({position})
    
    openGlobalMenu(menuId)
  }, [menuId, openGlobalMenu])

  const closeMenu = useCallback(() => {
    closeGlobalMenu()
  }, [closeGlobalMenu])

  const toggleMenu = useCallback((event) => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu(event)
    }
  }, [isOpen, openMenu, closeMenu])

  return {
    isOpen,
    position,
    openMenu,
    closeMenu,
    toggleMenu
  }
}
