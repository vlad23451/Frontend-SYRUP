/**
 * @fileoverview Адаптивный компонент навигации
 * 
 * Компонент, который автоматически выбирает между:
 * - Dock для десктопных устройств
 * - MobileBottomPanel для мобильных устройств
 */
import React from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Dock from './Dock'
import MobileBottomPanel from './MobileBottomPanel'

const ResponsiveDock = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return isMobile ? <MobileBottomPanel /> : <Dock />
}

export default ResponsiveDock
