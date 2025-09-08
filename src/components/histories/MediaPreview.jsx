/**
 * @fileoverview Компонент для отображения прикрепленных медиа файлов в истории
 * 
 * Функциональность:
 * - Отображение изображений с превью
 * - Встроенный плеер для видео и аудио
 * - Ссылки для скачивания документов
 * - Обновление истекших presigned ссылок
 * - Адаптивная сетка для множественных файлов
 */

import React, { useState, useEffect } from 'react'
import { getFileById, getMediaType, getFileIcon } from '../../services/mediaService'

const MediaPreview = ({ attachedFiles = [] }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  // Преобразование attached_files в формат с download_url
  useEffect(() => {
    if (!attachedFiles || attachedFiles.length === 0) {
      setFiles([])
      return
    }

    console.log('Processing attached files:', attachedFiles)

    const processFiles = async () => {
      setLoading(true)
      
      const processedFiles = await Promise.all(
        attachedFiles.map(async (file) => {
          try {
            // Получаем актуальную ссылку на файл по его ID
            const fileWithUrl = await getFileById(file.id)
            return {
              ...file,
              download_url: fileWithUrl.download_url,
              name: file.filename, // используем filename как name
              file_type: file.mime_type || file.file_type
            }
          } catch (err) {
            console.warn('Failed to get download URL for file:', file.id, err)
            // В качестве fallback можем попробовать сформировать URL из file_key
            const baseUrl = 'http://localhost:8000'
            return {
              ...file,
              download_url: `${baseUrl}/media/serve/${file.file_key}`,
              name: file.filename,
              file_type: file.mime_type || file.file_type
            }
          }
        })
      )
      
      console.log('Processed files with URLs:', processedFiles)
      setFiles(processedFiles)
      setLoading(false)
    }

    processFiles()
  }, [attachedFiles])

  // Обновление ссылки на файл при ошибке загрузки
  const refreshFileUrl = async (fileId, fileIndex) => {
    try {
      const updatedFile = await getFileById(fileId)
      setFiles(prevFiles => 
        prevFiles.map((file, index) => 
          index === fileIndex ? { 
            ...file, 
            download_url: updatedFile.download_url 
          } : file
        )
      )
    } catch (err) {
      console.error('Error refreshing file URL:', err)
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

  // Дополнительная функция для определения типа файла по имени
  const getMediaTypeByName = (fileName) => {
    if (!fileName) return 'other'
    
    const extension = fileName.toLowerCase().split('.').pop()
    
    // Изображения
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(extension)) {
      return 'image'
    }
    
    // Видео
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension)) {
      return 'video'
    }
    
    // Аудио
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(extension)) {
      return 'audio'
    }
    
    // Документы
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      return 'document'
    }
    
    return 'other'
  }

  // Рендер одного файла
  const renderMediaFile = (file, index) => {
    // Определяем тип файла несколькими способами
    let mediaType = file.mediaType || getMediaType(file.mime_type || file.file_type || '')
    
    // Если не удалось определить по MIME типу, пробуем по имени файла
    if (mediaType === 'other' && (file.name || file.filename)) {
      mediaType = getMediaTypeByName(file.name || file.filename)
    }
    
    // Если есть download_url, пробуем определить по URL
    if (mediaType === 'other' && file.download_url) {
      mediaType = getMediaTypeByName(file.download_url)
    }
    
    console.log('Rendering file:', {
      file,
      mime_type: file.mime_type,
      file_type: file.file_type,
      mediaType,
      name: file.name || file.filename,
      download_url: file.download_url
    })
    
    switch (mediaType) {
      case 'image':
        return (
          <div key={file.id} className="media-preview-item media-image">
            <img 
              src={file.download_url} 
              alt={file.description || 'Изображение'} 
              className="media-preview-img"
              onError={() => refreshFileUrl(file.id, index)}
              loading="lazy"
            />
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )

      case 'video':
        return (
          <div key={file.id} className="media-preview-item media-video">
            <video 
              controls 
              className="media-preview-video"
              onError={() => refreshFileUrl(file.id, index)}
              preload="metadata"
            >
              <source src={file.download_url} type={file.file_type} />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )

      case 'audio':
        return (
          <div key={file.id} className="media-preview-item media-audio">
            <div className="media-audio-header">
              <span className="media-audio-icon">🎵</span>
              <span className="media-audio-name">{file.name || file.filename || 'Аудио файл'}</span>
            </div>
            <audio 
              controls 
              className="media-preview-audio"
              onError={() => refreshFileUrl(file.id, index)}
              preload="metadata"
            >
              <source src={file.download_url} type={file.file_type} />
              Ваш браузер не поддерживает воспроизведение аудио.
            </audio>
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )

      case 'document':
      default:
        return (
          <div key={file.id} className="media-preview-item media-document">
            <a 
              href={file.download_url} 
              className="media-document-link"
              download={file.name || file.filename}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="media-document-icon">
                {getFileIcon(mediaType)}
              </div>
              <div className="media-document-info">
                <span className="media-document-name">{file.name || file.filename || 'Файл'}</span>
                {(file.size || file.file_size) && (
                  <span className="media-document-size">{formatFileSize(file.size || file.file_size)}</span>
                )}
              </div>
              <div className="media-document-download">
                ⬇️
              </div>
            </a>
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )
    }
  }

  // Если нет файлов и не загружаем - ничего не показываем
  if (!files.length && !loading) {
    return null
  }

  // Показываем загрузку только если загружаем
  if (loading) {
    return (
      <div className="media-preview-loading">
        <span>Загрузка файлов...</span>
      </div>
    )
  }

  return (
    <div className="media-preview">
      <div className={`media-preview-grid ${files.length === 1 ? 'single' : files.length === 2 ? 'double' : 'multiple'}`}>
        {files.map((file, index) => renderMediaFile(file, index))}
      </div>
    </div>
  )
}

export default MediaPreview
