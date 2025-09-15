/**
 * @fileoverview Кастомный медиаплеер для полноэкранного просмотра медиафайлов
 * 
 * Функциональность:
 * - Полноэкранный просмотр изображений, видео и аудио
 * - Навигация между медиафайлами (стрелки, клавиатура, свайпы)
 * - Контролы для скачивания, закрытия, информации о файле
 * - Масштабирование изображений
 * - Плейлист для аудио/видео файлов
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getMediaType } from '../../services/mediaService'

const MediaPlayerModal = ({ 
  isOpen, 
  onClose, 
  files = [], 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [scale, setScale] = useState(1)
  const [showInfo, setShowInfo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const modalRef = useRef(null)
  const imageRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const controlsTimeoutRef = useRef(null)

  const currentFile = files[currentIndex]
  const hasMultipleFiles = files.length > 1

  // Определяем тип медиа
  const getFileMediaType = (file) => {
    if (!file) return 'other'
    
    let mediaType = file.mediaType || getMediaType(file.mime_type || file.file_type || '')
    
    if (mediaType === 'other' && (file.name || file.filename)) {
      const extension = (file.name || file.filename).toLowerCase().split('.').pop()
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(extension)) {
        return 'image'
      }
      if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension)) {
        return 'video'
      }
      if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(extension)) {
        return 'audio'
      }
    }
    
    return mediaType
  }

  // Навигация с плавными переходами
  const goToNext = useCallback(() => {
    if (hasMultipleFiles && !isTransitioning) {
      setIsTransitioning(true)
      setScale(1)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % files.length)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 150)
    }
  }, [hasMultipleFiles, files.length, isTransitioning])

  const goToPrevious = useCallback(() => {
    if (hasMultipleFiles && !isTransitioning) {
      setIsTransitioning(true)
      setScale(1)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + files.length) % files.length)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 150)
    }
  }, [hasMultipleFiles, files.length, isTransitioning])

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case '+':
        case '=':
          setScale(prev => Math.min(prev + 0.2, 3))
          break
        case '-':
          setScale(prev => Math.max(prev - 0.2, 0.5))
          break
        case '0':
          setScale(1)
          break
        case 'i':
        case 'I':
          setShowInfo(!showInfo)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goToNext, goToPrevious, showInfo])

  // Управление контролами (автоскрытие)
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }, [])

  // Обработка движений мыши
  const handleMouseMove = useCallback(() => {
    resetControlsTimeout()
  }, [resetControlsTimeout])

  // Сенсорное управление
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    
    const minSwipeDistance = 50
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
  }

  // Масштабирование изображений
  const handleWheel = (e) => {
    if (getFileMediaType(currentFile) === 'image') {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setScale(prev => Math.max(0.5, Math.min(3, prev + delta)))
    }
  }

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Скачивание файла
  const handleDownload = () => {
    if (currentFile?.download_url) {
      const link = document.createElement('a')
      link.href = currentFile.download_url
      link.download = currentFile.name || currentFile.filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setScale(1)
      setShowInfo(false)
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    } else {
      resetControlsTimeout()
    }
  }, [isOpen, resetControlsTimeout])

  // Рендер контента медиафайла
  const renderMediaContent = () => {
    if (!currentFile) return null

    const mediaType = getFileMediaType(currentFile)

    switch (mediaType) {
      case 'image':
        return (
          <div 
            className="media-player-image-container"
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={currentFile.download_url}
              alt={currentFile.name || currentFile.filename || 'Изображение'}
              className={`media-player-image ${isTransitioning ? 'transitioning' : ''}`}
              style={{ transform: `scale(${scale})` }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        )

      case 'video':
        return (
          <video
            className={`media-player-video ${isTransitioning ? 'transitioning' : ''}`}
            controls
            autoPlay
            onLoadedData={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          >
            <source src={currentFile.download_url} type={currentFile.file_type} />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        )

      case 'audio':
        return (
          <div className={`media-player-audio-container ${isTransitioning ? 'transitioning' : ''}`}>
            <div className="media-player-audio-info">
              <div className="media-player-audio-icon">🎵</div>
              <div className="media-player-audio-title">
                {currentFile.name || currentFile.filename || 'Аудио файл'}
              </div>
            </div>
            <audio
              className="media-player-audio"
              controls
              autoPlay
              onLoadedData={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            >
              <source src={currentFile.download_url} type={currentFile.file_type} />
              Ваш браузер не поддерживает воспроизведение аудио.
            </audio>
          </div>
        )

      default:
        return (
          <div className="media-player-unsupported">
            <div className="media-player-unsupported-icon">📦</div>
            <div className="media-player-unsupported-text">
              Предварительный просмотр недоступен
            </div>
            <div className="media-player-unsupported-name">
              {currentFile.name || currentFile.filename || 'Файл'}
            </div>
          </div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="media-player-modal"
      ref={modalRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="media-player-backdrop" onClick={onClose} />
      
      <div className="media-player-content">
        {isLoading && (
          <div className="media-player-loading">
            <div className="spinner"></div>
            <span>Загрузка...</span>
          </div>
        )}

        {renderMediaContent()}

        {/* Основные контролы */}
        <div className={`media-player-controls ${showControls ? 'visible' : ''}`}>
          <div className="media-player-header">
            <div className="media-player-title">
              {currentFile?.name || currentFile?.filename || 'Медиафайл'}
              {hasMultipleFiles && (
                <span className="media-player-counter">
                  {currentIndex + 1} / {files.length}
                </span>
              )}
            </div>
            <div className="media-player-header-actions">
              <button
                className="media-player-btn"
                onClick={() => setShowInfo(!showInfo)}
                title="Информация (I)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </button>
              <button
                className="media-player-btn"
                onClick={handleDownload}
                title="Скачать"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button
                className="media-player-btn media-player-close"
                onClick={onClose}
                title="Закрыть (Esc)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Навигация */}
          {hasMultipleFiles && (
            <>
              <button
                className="media-player-nav media-player-nav-prev"
                onClick={goToPrevious}
                title="Предыдущий (←)"
              >
                ‹
              </button>
              <button
                className="media-player-nav media-player-nav-next"
                onClick={goToNext}
                title="Следующий (→)"
              >
                ›
              </button>
            </>
          )}

          {/* Контролы масштабирования для изображений */}
          {getFileMediaType(currentFile) === 'image' && (
            <div className="media-player-zoom-controls">
              <button
                className="media-player-btn"
                onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                title="Уменьшить (-)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span className="media-player-zoom-level">
                {Math.round(scale * 100)}%
              </span>
              <button
                className="media-player-btn"
                onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
                title="Увеличить (+)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button
                className="media-player-btn"
                onClick={() => setScale(1)}
                title="Сбросить масштаб (0)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Панель информации */}
        {showInfo && currentFile && (
          <div className="media-player-info">
            <h4>Информация о файле</h4>
            <div className="media-player-info-row">
              <span>Название:</span>
              <span>{currentFile.name || currentFile.filename || 'Неизвестно'}</span>
            </div>
            <div className="media-player-info-row">
              <span>Тип:</span>
              <span>{currentFile.file_type || currentFile.mime_type || 'Неизвестно'}</span>
            </div>
            <div className="media-player-info-row">
              <span>Размер:</span>
              <span>{formatFileSize(currentFile.size || currentFile.file_size)}</span>
            </div>
            {currentFile.description && (
              <div className="media-player-info-row">
                <span>Описание:</span>
                <span>{currentFile.description}</span>
              </div>
            )}
          </div>
        )}

        {/* Миниатюры для навигации (если файлов много) */}
        {hasMultipleFiles && files.length > 1 && (
          <div className="media-player-thumbnails">
            {files.map((file, index) => {
              const mediaType = getFileMediaType(file)
              return (
                <div
                  key={file.id}
                  className={`media-player-thumbnail ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    if (!isTransitioning && index !== currentIndex) {
                      setIsTransitioning(true)
                      setScale(1)
                      setTimeout(() => {
                        setCurrentIndex(index)
                        setTimeout(() => setIsTransitioning(false), 50)
                      }, 150)
                    }
                  }}
                >
                  {mediaType === 'image' ? (
                    <img src={file.download_url} alt="" />
                  ) : (
                    <div className="media-player-thumbnail-icon">
                      {mediaType === 'video' ? '🎥' : 
                       mediaType === 'audio' ? '🎵' : '📄'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaPlayerModal
