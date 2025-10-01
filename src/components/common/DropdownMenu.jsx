/**
 * @fileoverview Компонент выпадающего меню
 * 
 * Универсальный компонент выпадающего меню с кнопкой-триггером и списком опций.
 * Поддерживает позиционирование относительно триггера и закрытие при клике вне меню.
 * 
 * Функциональность:
 * - Кнопка-триггер с кастомным содержимым
 * - Выпадающий список с опциями
 * - Автоматическое позиционирование
 * - Закрытие при клике вне меню
 * - Поддержка мобильных устройств
 * 
 * @param {Object} props - свойства компонента
 * @param {React.ReactNode} props.trigger - содержимое кнопки-триггера
 * @param {Array} props.items - массив опций меню
 * @param {string} props.className - дополнительные CSS классы
 * @param {string} props.triggerClassName - CSS классы для кнопки-триггера
 * @param {string} props.menuClassName - CSS классы для выпадающего меню
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react'

const DropdownMenu = ({ 
  trigger, 
  items = [], 
  className = '', 
  triggerClassName = '',
  menuClassName = '',
  placement = 'bottom-end'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Закрытие меню при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const toggleMenu = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item, e) => {
    e.stopPropagation()
    if (item.onClick) {
      item.onClick()
    }
    setIsOpen(false)
  }

  const getMenuPosition = () => {
    if (!triggerRef.current) return {}
    
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const menuWidth = 200 // примерная ширина меню
    const menuHeight = items.length * 40 + 16 // примерная высота меню
    
    let top = triggerRect.bottom + 8
    let left = triggerRect.right - menuWidth
    
    // Проверяем, не выходит ли меню за границы экрана
    if (left < 8) {
      left = 8
    }
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8
    }
    if (top + menuHeight > window.innerHeight - 8) {
      top = triggerRect.top - menuHeight - 8
    }
    
    return { top, left }
  }

  const menuStyle = isOpen ? getMenuPosition() : {}

  return (
    <div className={`dropdown-menu-container ${className}`} ref={dropdownRef}>
      <button
        ref={triggerRef}
        className={`dropdown-menu-trigger ${triggerClassName}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div 
          className={`dropdown-menu ${menuClassName}`}
          style={menuStyle}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={`dropdown-menu-item ${item.className || ''}`}
              onClick={(e) => handleItemClick(item, e)}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.icon && (
                <span className="dropdown-menu-item-icon">
                  {item.icon}
                </span>
              )}
              <span className="dropdown-menu-item-text">
                {item.text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
