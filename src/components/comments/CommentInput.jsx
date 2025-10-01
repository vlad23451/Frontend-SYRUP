import React, { useRef, useState } from 'react'
import { uploadFile, getMediaType, getFileIcon } from '../../services/mediaService'

const CommentInput = ({ newComment, setNewComment, submitting, onSubmit, onFilesChange, attachedFiles = [] }) => {
  const [attachOpen, setAttachOpen] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(new Set())
  const [uploadError, setUploadError] = useState('')
  
  const fileInputRef = useRef(null)


  const openFilePicker = () => {
    setAttachOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadError('')
    
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
      setUploadError(error.message)
    } finally {
      // Убираем файлы из состояния "загружается"
      const updatedUploadingFiles = new Set(uploadingFiles)
      files.forEach(file => updatedUploadingFiles.delete(file.name))
      setUploadingFiles(updatedUploadingFiles)
      
      // Очищаем input
      e.target.value = ''
    }
  }

  const removeFile = (fileToRemove) => {
    onFilesChange(attachedFiles.filter(file => file.id !== fileToRemove.id))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="comment-input-wrapper">
      <form className="comment-form" onSubmit={onSubmit}>
        <div className="comment-input-container">
          <input
            type="text"
            className="comment-input"
            placeholder="Написать комментарий..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <div className="comment-actions">
            <button
              type="button"
              className="comment-attach-btn"
              onClick={() => setAttachOpen(!attachOpen)}
              disabled={submitting}
              title="Прикрепить файл"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
              </svg>
            </button>
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={(!newComment.trim() && attachedFiles.length === 0) || submitting}
              title="Отправить"
            >
              {submitting ? '…' : '➤'}
            </button>
          </div>
        </div>
      </form>

      {/* Меню прикрепления */}
      {attachOpen && (
        <div className="comment-attach-menu">
          <button 
            type="button" 
            className="comment-attach-item"
            onClick={openFilePicker}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
            </svg>
            Прикрепить файл
          </button>
        </div>
      )}

      {/* Скрытый input для выбора файлов */}
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden-file-input" 
        onChange={handleFileSelect} 
        multiple 
        tabIndex={-1} 
      />

      {/* Ошибка загрузки */}
      {uploadError && (
        <div className="comment-upload-error">
          <span className="error-text">{uploadError}</span>
        </div>
      )}

      {/* Список прикрепленных файлов */}
      {(attachedFiles.length > 0 || uploadingFiles.size > 0) && (
        <div className="comment-attachments">
          {attachedFiles.map((file) => (
            <div key={file.id} className="comment-attachment-item">
              <div className="comment-attachment-icon">
                {getFileIcon(file.mediaType)}
              </div>
              <div className="comment-attachment-info">
                <span className="comment-attachment-name">{file.name}</span>
                <span className="comment-attachment-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="comment-attachment-remove"
                onClick={() => removeFile(file)}
                disabled={submitting}
                title="Удалить файл"
              >
                ✕
              </button>
            </div>
          ))}
          
          {/* Файлы в процессе загрузки */}
          {Array.from(uploadingFiles).map((fileName) => (
            <div key={`uploading-${fileName}`} className="comment-attachment-item uploading">
              <div className="comment-attachment-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="comment-attachment-info">
                <span className="comment-attachment-name">{fileName}</span>
                <span className="comment-attachment-status">Загружается...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentInput


