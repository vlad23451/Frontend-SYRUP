import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'

const SettingsContext = createContext(null)

export const SettingsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('appearance')

  const open = useCallback(() => { setActiveSection(null); setIsOpen(true) }, [])
  const close = useCallback(() => { setIsOpen(false); setActiveSection(null) }, [])
  const openSection = useCallback((key) => { setActiveSection(key); setIsOpen(true) }, [])

  const value = useMemo(() => ({ isOpen, activeSection, open, close, openSection, setActiveSection }), [isOpen, activeSection, open, close, openSection])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
