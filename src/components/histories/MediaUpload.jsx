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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21.44 11.05L12 20.49a6 6 0 1 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.19 9.19a2 2 0 1 1-2.83-2.83l8.49-8.49"/>
            </svg>
          </button>
          
          {attachOpen && (
            <div className="attach-menu" role="menu">
              <button type="button" className="attach-item" onClick={() => openPicker(photoVideoInputRef)} role="menuitem">
                <span className="attach-ico">📷</span>
                Фото/Видео
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(audioInputRef)} role="menuitem">
                <span className="attach-ico">🎵</span>
                Аудио
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(docsInputRef)} role="menuitem">
                <span className="attach-ico">📄</span>
                Документы
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(otherInputRef)} role="menuitem">
                <span className="attach-ico">📦</span>
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
                ⏳
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
