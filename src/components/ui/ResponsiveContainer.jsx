/**
 * @fileoverview Адаптивный контейнер
 * 
 * Компонент контейнера с автоматической адаптацией под размер экрана
 */
import React from 'react'

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  padding = true,
  ...props 
}) => {
  const baseClasses = 'responsive-container'
  const paddingClass = padding ? 'responsive-padding' : ''
  const widthClass = maxWidth ? `max-w-${maxWidth}` : ''
  
  const classes = [
    baseClasses,
    paddingClass,
    widthClass,
    className
  ].filter(Boolean).join(' ')

  const style = {
    maxWidth: maxWidth,
    ...props.style
  }

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  )
}

export default ResponsiveContainer
