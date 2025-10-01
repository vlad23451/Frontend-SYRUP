/**
 * @fileoverview Адаптивная сетка
 * 
 * Компонент сетки с автоматической адаптацией под размер экрана
 */
import React from 'react'

const ResponsiveGrid = ({ 
  children, 
  className = '', 
  columns = { desktop: 3, tablet: 2, mobile: 1 },
  gap = '16px',
  ...props 
}) => {
  const baseClasses = 'responsive-grid'
  
  const classes = [
    baseClasses,
    className
  ].filter(Boolean).join(' ')

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.desktop}, 1fr)`,
    gap: gap,
    ...props.style
  }

  return (
    <div 
      className={classes} 
      style={style}
      data-columns={JSON.stringify(columns)}
      {...props}
    >
      {children}
    </div>
  )
}

export default ResponsiveGrid
