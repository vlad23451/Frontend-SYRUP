/**
 * @fileoverview Нижний док-навигация
 * 
 * Презентационный компонент, который:
 * - получает конфигурацию элементов и состояние из `useDockController`
 * - отображает пункты навигации и кнопки управления
 * - на странице `/following` добавляет кнопку «Друзья» (фильтр ленты)
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useDockController } from '../../hooks/useDockController'
import { useSettings } from '../../contexts/SettingsContext'

const Dock = observer(() => {
  const {
    dockRef,
    innerRef,
    handleRef,
    styleDock,
    items,
    isActivePath,
    isPeople,
    isAuthenticated,
    searchValue,
    setSearchValue,
    handleItemClick,
    showBackButton,
    isFollowingPage,
  } = useDockController()
  const { open } = useSettings()

  const isVertical = styleDock && (styleDock.left === 18 || styleDock.right === 18)

  return (
    <div className={`dock${isVertical ? ' vertical' : ''}`} ref={dockRef} style={styleDock}>
      <div className="dock-inner" ref={innerRef}>
        <div className="dock-grabber" ref={handleRef} aria-label="Переместить док" title="Переместить док" />

        {items.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className={`dock-item${isActivePath(to) ? ' active' : ''}`} title={label} onClick={(e) => handleItemClick(e, to, label)}>
            <span className="dock-icon" aria-hidden><Icon /></span>
            <span className="dock-label">{label}</span>
          </Link>
        ))}

        <span className="dock-separator" aria-hidden />

        {isAuthenticated && isFollowingPage ? (
          <Link to="/following?tab=friends" className={`dock-item`} title="Друзья">
            <span className="dock-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="3"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <span className="dock-label">Друзья</span>
          </Link>
        ) : null}

        {isAuthenticated && isPeople ? (
          <div className="dock-item" style={{gap: 4}} title="Поиск">
            <span className="dock-label" style={{fontSize: 10}}>Поиск</span>
            <input
              className="dock-search-input"
              type="text"
              value={searchValue}
              placeholder="Поиск друзей"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        ) : null}

        <button className="dock-item" title="Назад" onClick={(e) => { e.preventDefault(); open() }} style={{ display: showBackButton ? 'inline-flex' : 'none' }}>
          <span className="dock-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </span>
          <span className="dock-label">Назад</span>
        </button>

        <button className="dock-item" title="Настройки" onClick={(e) => { e.preventDefault(); open() }}>
          <span className="dock-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span className="dock-label">Настройки</span>
        </button>
      </div>
    </div>
  )
})

export default Dock
