/**
 * @fileoverview Сервис для работы с комментариями
 * 
 * Этот модуль содержит функции для взаимодействия с API комментариев.
 * Предоставляет методы для создания и получения комментариев к историям.
 * 
 * Функциональность:
 * - Создание новых комментариев
 * - Получение комментариев к истории
 * - Удаление комментариев
 * - Редактирование комментариев
 * - Лайки и дизлайки комментариев
 * - Интеграция с apiRequest для обработки HTTP запросов
 * 
 * API endpoints:
 * - POST /comments - создание нового комментария
 * - GET /history/id/{history_id}/comments - получение комментариев к истории
 * - DELETE /comments/{id} - удаление комментария
 * - PUT /comments/{id} - редактирование комментария
 * - POST /comment-likes/ - создание лайка комментария
 * - DELETE /comment-likes/{id} - удаление лайка комментария
 * - POST /comment-dislikes/ - создание дизлайка комментария
 * - DELETE /comment-dislikes/{id} - удаление дизлайка комментария
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const createComment = async (historyId,
                                    content,
                                    commentType = 'text',
                                    commentMetadata = {}) => {
  return apiRequest('/comments', {
    method: 'POST',
    body: JSON.stringify({
      history_id: historyId,
      content,
      comment_type: commentType,
      comment_metadata: commentMetadata
    })
  })
}

export const getComments = async (historyId) => {
  return apiRequest(`/history/id/${historyId}/comments`)
}

export const deleteComment = async (commentId) => {
  return apiRequest(`/comments/${commentId}`, {
    method: 'DELETE',
    json: false
  })
}

export const updateComment = async (commentId, content) => {
  return apiRequest(`/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content })
  })
}

export const createCommentLike = async (commentId) => {
  const response = await apiRequest('/comment-likes/', {
    method: 'POST',
    body: JSON.stringify({ comment_id: commentId })
  })
  return response
}

export const deleteCommentLike = async (likeId) => {
  return apiRequest(`/comment-likes/${likeId}`, {
    method: 'DELETE',
    json: false
  })
}

export const createCommentDislike = async (commentId) => {
  const response = await apiRequest('/comment-dislikes/', {
    method: 'POST',
    body: JSON.stringify({ comment_id: commentId })
  })
  return response
}

export const deleteCommentDislike = async (dislikeId) => {
  return apiRequest(`/comment-dislikes/${dislikeId}`, {
    method: 'DELETE',
    json: false
  })
}
