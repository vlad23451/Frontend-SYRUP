import React, { useState, useRef } from 'react'
import { uploadFile, getMediaType, getFileIcon } from '../../services/mediaService'
import { addFilesToComment, replaceCommentFiles } from '../../services/commentService'
import '../../styles/edit-attachments.css'

const EditCommentAttachments = ({ comment, onUpdate, onClose, isOpen = false }) => {
  const [attachedFiles, setAttachedFiles] = useState(comment.attached_files || [])
  const [newFiles, setNewFiles] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setError('')
    
    const newUploadingFiles = new Set(uploadingFiles)
    files.forEach(file => newUploadingFiles.add(file.name))
    setUploadingFiles(newUploadingFiles)

    try {
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
      
      setNewFiles(prev => [...prev, ...uploadedFiles])
      
    } catch (error) {
      setError(error.message)
    } finally {
      const updatedUploadingFiles = new Set(uploadingFiles)
      files.forEach(file => updatedUploadingFiles.delete(file.name))
      setUploadingFiles(updatedUploadingFiles)
      
      e.target.value = ''
    }
  }

  const removeExistingFile = (fileToRemove) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileToRemove.id))
  }

  const removeNewFile = (fileToRemove) => {
    setNewFiles(prev => prev.filter(file => file.id !== fileToRemove.id))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')

    try {
      const hasRemovedFiles = attachedFiles.length < (comment.attached_files || []).length
      
      if (hasRemovedFiles) {
        const existingFileIds = attachedFiles.map(file => file.id)
        const newFileIds = newFiles.map(file => file.id)
        const allFileIds = [...existingFileIds, ...newFileIds]
        
        await replaceCommentFiles(comment.id, allFileIds)
      } else if (newFiles.length > 0) {
        const newFileIds = newFiles.map(file => file.id)
        await addFilesToComment(comment.id, newFileIds)
      }

      const updatedComment = {
        ...comment,
        attached_files: [...attachedFiles, ...newFiles]
      }
      
      onUpdate(updatedComment)
      onClose()
      
    } catch (error) {
      setError(`Ошибка сохранения: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop" onClick={(e) => {
      if (e.target.classList.contains('custom-modal-backdrop')) onClose()
    }}>
      <div className="edit-attachments-modal">
      <div className="edit-attachments-header">
        <h3>Редактировать вложения</h3>
        <button 
          className="close-btn" 
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
      </div>

      <div className="edit-attachments-content">
        {attachedFiles.length > 0 && (
          <div className="attachments-section">
            <h4>Текущие вложения</h4>
            <div className="attachments-list">
              {attachedFiles.map((file) => (
                <div key={file.id} className="attachment-item existing">
                  <div className="attachment-icon">
                    {getFileIcon(file.media_type || 'other')}
                  </div>
                  <div className="attachment-info">
                    <span className="attachment-name">{file.name || file.filename}</span>
                    <span className="attachment-size">{formatFileSize(file.size || 0)}</span>
                  </div>
                  <button
                    className="attachment-remove"
                    onClick={() => removeExistingFile(file)}
                    disabled={loading}
                    title="Удалить вложение"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="attachments-section">
          <h4>Добавить файлы</h4>
          <button
            className="add-files-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
            </svg>
            Выбрать файлы
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
          />

          {(newFiles.length > 0 || uploadingFiles.size > 0) && (
            <div className="attachments-list">
              {newFiles.map((file) => (
                <div key={file.id} className="attachment-item new">
                  <div className="attachment-icon">
                    {getFileIcon(file.mediaType)}
                  </div>
                  <div className="attachment-info">
                    <span className="attachment-name">{file.name}</span>
                    <span className="attachment-size">{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    className="attachment-remove"
                    onClick={() => removeNewFile(file)}
                    disabled={loading}
                    title="Удалить файл"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {Array.from(uploadingFiles).map((fileName) => (
                <div key={`uploading-${fileName}`} className="attachment-item uploading">
                  <div className="attachment-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                  </div>
                  <div className="attachment-info">
                    <span className="attachment-name">{fileName}</span>
                    <span className="attachment-status">Загружается...</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="edit-attachments-actions">
        <button
          className="cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Отмена
        </button>
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
      </div>
    </div>
  )
}

export default EditCommentAttachments
