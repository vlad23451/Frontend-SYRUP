/**
 * @fileoverview Мобильная нижняя панель навигации
 * 
 * Презентационный компонент для мобильных устройств, который:
 * - получает конфигурацию элементов и состояние из `useDockController`
 * - отображает пункты навигации в виде статической панели внизу
 * - на странице `/following` добавляет кнопку «Друзья» (фильтр ленты)
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useDockController } from '../../hooks/useDockController'
import { useSettings } from '../../contexts/SettingsContext'

const MobileBottomPanel = observer(() => {
  const {
    items,
    isActivePath,
    isAuthenticated,
    isFollowingPage,
    isPeople,
    searchValue,
    setSearchValue,
    handleItemClick,
    showBackButton,
  } = useDockController()
  const { open } = useSettings()
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Фокусируемся на поле ввода при раскрытии
      setTimeout(() => {
        const input = document.querySelector('.mobile-panel-search-input')
        if (input) input.focus()
      }, 100)
    }
  }

  return (
    <div className="mobile-bottom-panel">
      <div className="mobile-panel-items">
        {items.map(({ to, label, Icon }) => (
          <Link 
            key={to} 
            to={to} 
            className={`mobile-panel-item ${isActivePath(to) ? 'active' : ''}`}
            title={label}
            onClick={(e) => handleItemClick(e, to, label)}
          >
            <span className="mobile-panel-icon" aria-hidden>
              <Icon />
            </span>
            <span className="mobile-panel-label">{label}</span>
          </Link>
        ))}

        {isAuthenticated && isFollowingPage && (
          <Link 
            to="/following?tab=friends" 
            className="mobile-panel-item" 
            title="Друзья"
          >
            <span className="mobile-panel-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="3"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <span className="mobile-panel-label">Друзья</span>
          </Link>
        )}

        {isAuthenticated && isPeople && (
          <div className={`mobile-panel-item mobile-panel-search ${isSearchExpanded ? 'expanded' : ''}`} title="Поиск">
            <input
              className="mobile-panel-search-input"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={() => {
                // Скрываем поле если оно пустое
                if (!searchValue.trim()) {
                  setIsSearchExpanded(false)
                }
              }}
            />
            <svg 
              className="mobile-panel-icon" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              onClick={handleSearchIconClick}
              style={{ cursor: 'pointer' }}
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        )}

        <button 
          className="mobile-panel-item" 
          title="Назад" 
          onClick={(e) => { e.preventDefault(); open() }} 
          style={{ display: showBackButton ? 'flex' : 'none' }}
        >
          <span className="mobile-panel-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </span>
          <span className="mobile-panel-label">Назад</span>
        </button>

        <button 
          className="mobile-panel-item" 
          title="Настройки" 
          onClick={(e) => { e.preventDefault(); open() }}
        >
          <span className="mobile-panel-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span className="mobile-panel-label">Настройки</span>
        </button>
      </div>
    </div>
  )
})

export default MobileBottomPanel
