import React, { useState, useRef } from 'react'
import { PrivateMediaService } from '../../services/privateMediaService'

const MessageInput = ({ onSend, replyTo, onCancelReply, disabled = false }) => {
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(new Set()) // ID файлов, которые загружаются
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Проверяем, есть ли файлы, которые еще загружаются
    const hasUploadingFiles = uploadingFiles.size > 0
    const hasUnuploadedFiles = selectedFiles.some(f => !f.uploaded)
    const hasValidFiles = selectedFiles.some(f => f.uploaded && f.fileId && !f.uploadError)
    
    if ((input.trim() || hasValidFiles) && !disabled && !uploading && !hasUploadingFiles && !hasUnuploadedFiles) {
      setUploading(true)
      try {
        // Отправляем сообщение с прикрепленными файлами (только успешно загруженные)
        const validFiles = selectedFiles.filter(f => f.uploaded && f.fileId && !f.uploadError)
        await onSend(input, validFiles)
        setInput('')
        setSelectedFiles([])
        setUploadingFiles(new Set())
        // Очищаем input файла
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Ошибка отправки сообщения:', error)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleFileSelect = async (e) => {
    if (disabled || uploading) return
    
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Добавляем информацию о типе файла для каждого файла
      const filesWithInfo = files.map(file => ({
        file,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        typeInfo: PrivateMediaService.getFileTypeInfo(file.name),
        uploaded: false, // Флаг загрузки
        fileId: null, // ID файла с сервера
        uploadError: null // Ошибка загрузки
      }))
      
      setSelectedFiles(prev => [...prev, ...filesWithInfo])
      
      // Загружаем файлы сразу после выбора
      for (const fileInfo of filesWithInfo) {
        setUploadingFiles(prev => new Set([...prev, fileInfo.id]))
        
        try {
          const fileId = await PrivateMediaService.uploadFile(fileInfo.file)
          
          // Обновляем файл с полученным ID
          setSelectedFiles(prev => prev.map(f => 
            f.id === fileInfo.id 
              ? { ...f, uploaded: true, fileId }
              : f
          ))
          
          console.log('Файл загружен:', fileInfo.file.name, 'ID:', fileId)
        } catch (error) {
          console.error('Ошибка загрузки файла:', fileInfo.file.name, error)
          
          // Помечаем файл как загруженный с ошибкой
          setSelectedFiles(prev => prev.map(f => 
            f.id === fileInfo.id 
              ? { ...f, uploaded: true, uploadError: error.message }
              : f
          ))
        } finally {
          setUploadingFiles(prev => {
            const newSet = new Set(prev)
            newSet.delete(fileInfo.id)
            return newSet
          })
        }
      }
    }
  }

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  return (
    <form onSubmit={handleSubmit} className="message-form">
      {replyTo && (
        <div className="reply-preview">
          <div className="reply-title">Ответ на сообщение</div>
          <div className="reply-body">
            <div className="reply-user">{replyTo.user}</div>
            <div className="reply-text">{replyTo.text?.slice(0, 160) || ''}</div>
          </div>
          <button type="button" className="reply-cancel" onClick={onCancelReply} title="Отменить">
            ×
          </button>
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div className="selected-files">
          {selectedFiles.map((fileInfo) => {
            const isUploading = uploadingFiles.has(fileInfo.id)
            const hasError = fileInfo.uploadError
            const isUploaded = fileInfo.uploaded && fileInfo.fileId && !hasError
            
            return (
              <div key={fileInfo.id} className={`selected-file ${hasError ? 'error' : ''} ${isUploaded ? 'uploaded' : ''}`}>
                <span className="file-icon">
                  {isUploading ? '⏳' : hasError ? '❌' : isUploaded ? '✅' : fileInfo.typeInfo.icon}
                </span>
                <span className="file-name" title={fileInfo.file.name}>
                  {fileInfo.file.name}
                </span>
                <span className="file-size">
                  {formatFileSize(fileInfo.file.size)}
                </span>
                {hasError && (
                  <span className="error-message" title={fileInfo.uploadError}>
                    Ошибка загрузки
                  </span>
                )}
                <button 
                  type="button" 
                  className="remove-file-btn"
                  onClick={() => removeFile(fileInfo.id)}
                  disabled={disabled || uploading || isUploading}
                  title="Удалить файл"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
      <div className="message-input-container">
        <label className={`attach-file-btn ${disabled || uploading || uploadingFiles.size > 0 ? 'disabled' : ''}`} title="Прикрепить файл">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={disabled || uploading || uploadingFiles.size > 0}
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          📎
        </label>
        <input
          type="text"
          className={`message-input ${disabled || uploading || uploadingFiles.size > 0 ? 'disabled' : ''}`}
          placeholder={
            uploadingFiles.size > 0 ? "Загрузка файлов..." :
            uploading ? "Отправка сообщения..." : 
            disabled ? "Подключение к чату..." : 
            "Введите сообщение..."
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={disabled || uploading || uploadingFiles.size > 0}
        />
        <button 
          type="submit" 
          className={`send-btn ${disabled || uploading || uploadingFiles.size > 0 ? 'disabled' : ''}`} 
          disabled={disabled || uploading || uploadingFiles.size > 0}
          title={
            uploadingFiles.size > 0 ? "Загрузка файлов..." :
            uploading ? "Отправка сообщения..." : 
            "Отправить сообщение"
          }
        >
          {uploadingFiles.size > 0 ? '⏳' : uploading ? '⏳' : '➤'}
        </button>
      </div>
    </form>
  )
}

// Функция для форматирования размера файла
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default MessageInput
