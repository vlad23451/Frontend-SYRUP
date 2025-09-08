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

/**
 * Загрузка файла на сервер
 * @param {File} file - Файл для загрузки
 * @param {string} description - Описание файла (опционально)
 * @param {boolean} isPublic - Публичный ли файл (опционально)
 * @returns {Promise<{id: string, file_key: string, file_type: string, download_url: string}>}
 */
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

/**
 * Прикрепление загруженного файла к истории
 * @param {string} fileId - ID загруженного файла  
 * @param {string} historyId - ID истории
 * @returns {Promise<any>}
 */
export const attachFileToHistory = async (fileId, historyId) => {
  return apiRequest('/media/attach', {
    method: 'POST',
    body: JSON.stringify({
      file_id: fileId,
      history_id: historyId
    })
  })
}

/**
 * Получение всех файлов прикрепленных к истории
 * @param {string} historyId - ID истории
 * @returns {Promise<Array<{id: string, file_key: string, file_type: string, download_url: string, description?: string}>>}
 */
export const getHistoryFiles = async (historyId) => {
  return apiRequest(`/media/history/${historyId}/files`)
}

/**
 * Получение актуальной ссылки на файл (для обновления истекших presigned URL)
 * @param {string} fileId - ID файла
 * @returns {Promise<{id: string, file_key: string, file_type: string, download_url: string}>}
 */
export const getFileById = async (fileId) => {
  return apiRequest(`/media/files/${fileId}`)
}

/**
 * Открепление файла от истории
 * @param {string} fileId - ID файла
 * @param {string} historyId - ID истории
 * @returns {Promise<any>}
 */
export const detachFile = async (fileId, historyId) => {
  return apiRequest('/media/detach', {
    method: 'POST',
    body: JSON.stringify({
      file_id: fileId,
      history_id: historyId
    })
  })
}

/**
 * Полное удаление файла (из S3 и БД)
 * @param {string} fileId - ID файла
 * @returns {Promise<any>}
 */
export const deleteFile = async (fileId) => {
  return apiRequest(`/media/files/${fileId}`, {
    method: 'DELETE',
    json: false
  })
}

/**
 * Определение типа медиа файла по MIME типу
 * @param {string} mimeType - MIME тип файла
 * @returns {'image'|'video'|'audio'|'document'|'other'}
 */
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

/**
 * Получение иконки для типа файла
 * @param {string} mediaType - Тип медиа ('image'|'video'|'audio'|'document'|'other')
 * @returns {string} - Эмодзи иконка
 */
export const getFileIcon = (mediaType) => {
  switch (mediaType) {
    case 'image': return '🖼️'
    case 'video': return '🎥'
    case 'audio': return '🎵'
    case 'document': return '📄'
    default: return '📦'
  }
}
