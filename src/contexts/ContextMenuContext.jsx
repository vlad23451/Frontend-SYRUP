import React, { createContext, useContext, useState, useCallback } from 'react'

const ContextMenuContext = createContext()

export const useGlobalContextMenu = () => {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error('useGlobalContextMenu must be used within a ContextMenuProvider')
  }
  return context
}

export const ContextMenuProvider = ({ children }) => {
  const [activeMenuId, setActiveMenuId] = useState(null)

  const openMenu = useCallback((menuId) => {
    setActiveMenuId(menuId)
  }, [])

  const closeMenu = useCallback(() => {
    setActiveMenuId(null)
  }, [])

  const isMenuOpen = useCallback((menuId) => {
    return activeMenuId === menuId
  }, [activeMenuId])

  return (
    <ContextMenuContext.Provider value={{
      activeMenuId,
      openMenu,
      closeMenu,
      isMenuOpen
    }}>
      {children}
    </ContextMenuContext.Provider>
  )
}
