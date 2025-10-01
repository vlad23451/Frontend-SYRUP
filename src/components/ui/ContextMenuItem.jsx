import React from 'react'

const ContextMenuItem = ({ 
  children, 
  onClick, 
  icon, 
  disabled = false, 
  danger = false, 
  separator = false,
  className = '',
  ...props 
}) => {
  if (separator) {
    return <div className="context-menu-separator" />
  }

  return (
    <button
      className={`context-menu-item ${danger ? 'danger' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <span className="context-menu-item-icon">
          {icon}
        </span>
      )}
      <span className="context-menu-item-text">
        {children}
      </span>
    </button>
  )
}

export default ContextMenuItem
