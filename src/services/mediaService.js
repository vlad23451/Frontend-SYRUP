import React from 'react'
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

export const attachFileToComment = async (fileId, commentId) => {
  return apiRequest('/media/attach', {
    method: 'POST',
    body: JSON.stringify({
      file_id: fileId,
      comment_id: commentId
    })
  })
}

export const getHistoryFiles = async (historyId) => {
  return apiRequest(`/media/history/${historyId}/files`)
}

export const getCommentFiles = async (commentId) => {
  return apiRequest(`/media/comment/${commentId}/files`)
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
    case 'image': 
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      )
    case 'video': 
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      )
    case 'audio': 
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      )
    case 'document': 
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      )
    default: 
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      )
  }
}
