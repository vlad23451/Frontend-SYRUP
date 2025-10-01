/**
 * @fileoverview Компонент кнопки с тремя точками
 * 
 * Простая кнопка с иконкой трех точек для вызова выпадающего меню.
 * Использует SVG иконку и поддерживает кастомизацию через props.
 * 
 * @param {Object} props - свойства компонента
 * @param {Function} props.onClick - обработчик клика
 * @param {string} props.className - дополнительные CSS классы
 * @param {string} props.title - текст подсказки
 * @param {boolean} props.disabled - состояние отключения
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React from 'react'

const ThreeDotsButton = ({ 
  onClick, 
  className = '', 
  title = 'Дополнительные действия',
  disabled = false 
}) => {
  return (
    <div
      className={`three-dots-button ${className}`}
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1"/>
        <circle cx="12" cy="5" r="1"/>
        <circle cx="12" cy="19" r="1"/>
      </svg>
    </div>
  )
}

export default ThreeDotsButton
