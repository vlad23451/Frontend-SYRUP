import React, { useEffect, useRef, useState } from 'react'
import ModalHeader from '../ui/ModalHeader'
import Avatar from '../ui/Avatar'

const UsersListModal = ({ open, title, users, loading, error, onClose, onUserClick, onActionRender, onSearch, searchType }) => {
  const containerRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEsc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onEsc)
    }
  }, [open, onClose])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query, searchType)
    }
  }

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Фокусируемся на поле ввода при раскрытии
      setTimeout(() => {
        const input = document.querySelector('.search-input-container input')
        if (input) input.focus()
      }, 100)
    }
  }


  if (!open) return null

  return (
    <div className="custom-modal-backdrop" onClick={(e) => { if (e.target.classList.contains('custom-modal-backdrop')) onClose && onClose() }}>
      <div className="custom-modal" ref={containerRef} style={{ maxWidth: 520 }}>
        <ModalHeader title={title} onClose={onClose} hideClose={true} />
        <div className="custom-modal-body">
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div className={`search-input-container ${isSearchExpanded ? 'expanded' : ''}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                onBlur={() => {
                  // Скрываем поле если оно пустое
                  if (!searchQuery.trim()) {
                    setIsSearchExpanded(false)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: '14px'
                }}
              />
              <svg 
                className="search-icon" 
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
          </div>
          {loading && <div className="modal-loading">Загрузка...</div>}
          {error && <div className="modal-error">Ошибка: {error}</div>}
          {!loading && !error && (
            <div className="people-list" style={{ maxHeight: 420, overflow: 'auto' }}>
              {(users || []).length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', opacity: 0.8 }}>Список пуст</div>
              ) : (
                users.map(user => (
                  <div key={user.id} className="people-list-item" style={{ cursor: 'pointer' }} onClick={() => onUserClick && onUserClick(user)}>
                    <Avatar
                      avatarUrl={user.avatar_url || user.user_info?.avatar_url}
                      size={56}
                      alt={user.login}
                      className="people-list-avatar"
                    />
                    <div className="people-list-info">
                      <span className="people-list-login">{user.login}</span>
                      {user.name && <span className="people-list-name">{user.name}</span>}
                    </div>
                    {onActionRender && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {onActionRender(user)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersListModal


