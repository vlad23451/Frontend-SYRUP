import React from 'react'

const AvatarEditButton = ({ onClick, disabled, uploading, className = '', style = {} }) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && onClick) {
      onClick()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  return (
    <div
      className={`avatar-edit-button ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={uploading ? 'Загрузка...' : 'Изменить аватар'}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        outline: 'none',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(1.1)'
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = 'none'
        }
      }}
    >
      {uploading ? '⏳' : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      )}
    </div>
  )
}

export default AvatarEditButton
