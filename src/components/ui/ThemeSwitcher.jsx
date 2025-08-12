import React, { useEffect, useState } from 'react'

const ThemeSwitcher = ({ variant = 'default' }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (variant === 'dock') {
    const isLight = theme === 'light'
    return (
      <button
        className="dock-item"
        onClick={toggleTheme}
        title={isLight ? 'Тёмная тема' : 'Светлая тема'}
        aria-label={isLight ? 'Включить тёмную тему' : 'Включить светлую тему'}
      >
        <span className="dock-emoji" aria-hidden>{isLight ? '🌙' : '☀️'}</span>
        <span className="dock-label">Тема</span>
      </button>
    )
  }

  return (
    <button onClick={toggleTheme} style={{marginLeft: 12, padding: '8px 16px', borderRadius: 8, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', fontWeight: 500, cursor: 'pointer'}}>
      {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
    </button>
  )
}

export default ThemeSwitcher
