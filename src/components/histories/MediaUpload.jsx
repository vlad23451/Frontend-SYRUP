/**
 * @fileoverview Компонент для загрузки и управления медиа файлами в формах историй
 * 
 * Функциональность:
 * - Выбор файлов через интерфейс прикрепления
 * - Предпросмотр выбранных файлов
 * - Загрузка файлов на сервер 
 * - Управление состоянием загрузки
 * - Удаление файлов из списка
 */

import React, { useRef, useState } from 'react'
import { uploadFile, getMediaType, getFileIcon } from '../../services/mediaService'

const MediaUpload = ({ attachedFiles, onFilesChange, loading: formLoading, error: uploadError, setError }) => {
  const [attachOpen, setAttachOpen] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(new Set())
  
  // Рефы для скрытых input элементов
  const photoVideoInputRef = useRef(null)
  const audioInputRef = useRef(null)
  const docsInputRef = useRef(null)
  const otherInputRef = useRef(null)

  // Открытие файлового пикера
  const openPicker = (ref) => {
    setAttachOpen(false)
    if (ref && ref.current) {
      ref.current.click()
    }
  }

  // Обработка выбора файлов
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setError('')
    
    // Добавляем файлы в состояние "загружается"
    const newUploadingFiles = new Set(uploadingFiles)
    files.forEach(file => newUploadingFiles.add(file.name))
    setUploadingFiles(newUploadingFiles)

    try {
      // Загружаем файлы параллельно
      const uploadPromises = files.map(async (file) => {
        try {
          const uploadedFile = await uploadFile(file)
          return {
            ...uploadedFile,
            originalFile: file,
            mediaType: getMediaType(file.type),
            name: file.name,
            size: file.size
          }
        } catch (error) {
          console.error(`Ошибка загрузки файла ${file.name}:`, error)
          throw new Error(`Ошибка загрузки ${file.name}: ${error.message}`)
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      
      // Добавляем успешно загруженные файлы к уже прикрепленным
      onFilesChange([...attachedFiles, ...uploadedFiles])
      
    } catch (error) {
      setError(error.message)
    } finally {
      // Убираем файлы из состояния "загружается"
      const updatedUploadingFiles = new Set(uploadingFiles)
      files.forEach(file => updatedUploadingFiles.delete(file.name))
      setUploadingFiles(updatedUploadingFiles)
      
      // Очищаем input
      e.target.value = ''
    }
  }

  // Удаление файла из списка
  const removeFile = (fileToRemove) => {
    onFilesChange(attachedFiles.filter(file => file.id !== fileToRemove.id))
  }

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="media-upload">
      {/* Кнопка прикрепления и меню */}
      <div className="form-attach-row">
        <div className="form-attach-bar">
          <button
            type="button"
            className="attach-trigger"
            aria-haspopup="true"
            aria-expanded={attachOpen}
            onClick={() => setAttachOpen((v) => !v)}
            disabled={formLoading}
            title="Прикрепить"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </button>
          
          {attachOpen && (
            <div className="attach-menu" role="menu">
              <button type="button" className="attach-item" onClick={() => openPicker(photoVideoInputRef)} role="menuitem">
                <span className="attach-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                </span>
                Фото/Видео
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(audioInputRef)} role="menuitem">
                <span className="attach-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                </span>
                Аудио
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(docsInputRef)} role="menuitem">
                <span className="attach-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </span>
                Документы
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(otherInputRef)} role="menuitem">
                <span className="attach-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </span>
                Другое
              </button>
            </div>
          )}
          
          {/* Скрытые input элементы для выбора файлов */}
          <input 
            ref={photoVideoInputRef} 
            type="file" 
            className="hidden-file-input" 
            onChange={handleFileSelect} 
            multiple 
            accept="image/*,video/*" 
            tabIndex={-1} 
          />
          <input 
            ref={audioInputRef} 
            type="file" 
            className="hidden-file-input" 
            onChange={handleFileSelect} 
            multiple 
            accept="audio/*" 
            tabIndex={-1} 
          />
          <input 
            ref={docsInputRef} 
            type="file" 
            className="hidden-file-input" 
            onChange={handleFileSelect} 
            multiple 
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" 
            tabIndex={-1} 
          />
          <input 
            ref={otherInputRef} 
            type="file" 
            className="hidden-file-input" 
            onChange={handleFileSelect} 
            multiple 
            accept=".zip,.rar,.7z" 
            tabIndex={-1} 
          />
        </div>
      </div>

      {/* Ошибка загрузки */}
      {uploadError && (
        <div className="media-upload-error">
          <span className="error-text">{uploadError}</span>
        </div>
      )}

      {/* Список прикрепленных файлов */}
      {(attachedFiles.length > 0 || uploadingFiles.size > 0) && (
        <div className="media-upload-list">
          {/* Загруженные файлы */}
          {attachedFiles.map((file) => (
            <div key={file.id} className="media-upload-item">
              <div className="media-upload-icon">
                {getFileIcon(file.mediaType)}
              </div>
              <div className="media-upload-info">
                <span className="media-upload-name">{file.name}</span>
                <span className="media-upload-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="media-upload-remove"
                onClick={() => removeFile(file)}
                disabled={formLoading}
                title="Удалить файл"
              >
                ✕
              </button>
            </div>
          ))}
          
          {/* Файлы в процессе загрузки */}
          {Array.from(uploadingFiles).map((fileName) => (
            <div key={`uploading-${fileName}`} className="media-upload-item uploading">
              <div className="media-upload-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="media-upload-info">
                <span className="media-upload-name">{fileName}</span>
                <span className="media-upload-status">Загружается...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MediaUpload
