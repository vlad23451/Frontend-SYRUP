/**
 * @fileoverview Адаптивная кнопка
 * 
 * Компонент кнопки с автоматической адаптацией под размер экрана
 */
import React from 'react'

const ResponsiveButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'responsive-btn'
  const variantClasses = {
    primary: 'custom-modal-btn confirm',
    secondary: 'custom-modal-btn cancel',
    danger: 'custom-modal-btn danger'
  }
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  }
  const widthClass = fullWidth ? 'w-full' : ''
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.medium,
    widthClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default ResponsiveButton
