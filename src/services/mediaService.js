/**
 * @fileoverview Сервис для работы с медиа файлами: загрузка, прикрепление к историям, получение
 * 
 * Поток работы:
 * 1. Загрузить файл через uploadFile
 * 2. Прикрепить к истории через attachFileToHistory  
 * 3. Получить файлы истории через getHistoryFiles
 * 4. При необходимости обновить ссылки через getFileById
 * 5. Открепить/удалить через detachFile/deleteFile
 */

import { apiRequest } from '../utils/apiUtils'

export const uploadFile = async (file, description = '', isPublic = true) => {
  const formData = new FormData()
  formData.append('file', file)
  if (description) formData.append('description', description)
  formData.append('is_public', isPublic.toString())

  return apiRequest('/media/upload', {
    method: 'POST',
    body: formData
  })
}

export const attachFileToHistory = async (fileId, historyId) => {
  return apiRequest('/media/attach', {
    method: 'POST',
    body: JSON.stringify({
      file_id: fileId,
      history_id: historyId
    })
  })
}

export const getHistoryFiles = async (historyId) => {
  return apiRequest(`/media/history/${historyId}/files`)
}

export const getFileById = async (fileId) => {
  return apiRequest(`/media/files/${fileId}`)
}

export const detachFile = async (fileId, historyId) => {
  return apiRequest('/media/detach', {
    method: 'POST',
    body: JSON.stringify({
      file_id: fileId,
      history_id: historyId
    })
  })
}

export const deleteFile = async (fileId) => {
  return apiRequest(`/media/files/${fileId}`, {
    method: 'DELETE',
    json: false
  })
}

export const getMediaType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || 
      mimeType.includes('document') || 
      mimeType.includes('spreadsheet') || 
      mimeType.includes('presentation') ||
      mimeType.includes('text/')) return 'document'
  return 'other'
}

export const getFileIcon = (mediaType) => {
  switch (mediaType) {
    case 'image': return '🖼️'
    case 'video': return '🎥'
    case 'audio': return '🎵'
    case 'document': return '📄'
    default: return '📦'
  }
}
