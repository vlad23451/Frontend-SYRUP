import React from 'react'
import { formatHistoryDateTime } from '../../utils/dateUtils'
import Avatar from '../ui/Avatar'
import { useProfileModal } from '../../contexts/ProfileModalContext'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const CommentItem = ({
  comment,
  editingComment,
  editText,
  setEditText,
  startEditing,
  cancelEditing,
  handleEditComment,
  toggleLike,
  toggleDislike,
  onDelete,
  isAuthenticated,
  isOwnComment,
}) => {
  const c = comment
  const { openProfileModal } = useProfileModal()
  const userId = c?.user_info?.id
  const handleOpenProfile = (e) => {
    e.stopPropagation()
    if (userId) openProfileModal(userId)
  }
  return (
    <div className="comment-item">
      <div className="comment-avatar">
        <div style={{cursor:'pointer', width:'100%', height:'100%'}} onClick={handleOpenProfile} title="Открыть профиль">
          <Avatar
            avatarUrl={c.user_info.avatar_url}
            size={40}
            alt={c.user_info.login}
            className="comment-avatar-img"
          />
        </div>
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author" style={{cursor:'pointer'}} onClick={handleOpenProfile} title="Открыть профиль">
            {c.user_info.login}
          </span>
          <span className="comment-time">{formatHistoryDateTime(c.created_at, userTimezone)}</span>
        </div>
        {editingComment === c.id ? (
          <div className="comment-edit-container">
            <textarea
              className="comment-text-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEditComment(c.id, editText);
                } else if (e.key === 'Escape') {
                  cancelEditing();
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <div className="comment-text">{c.content}</div>
        )}
        <div className="comment-actions">
          <button
            type="button"
            className="comment-action-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggleLike(c.id)}
            aria-pressed={!!c.isLikeActive}
            title={c.isLikeActive ? 'Убрать лайк' : 'Поставить лайк'}
            style={{ color: c.isLikeActive ? '#1E90FF' : undefined }}
            disabled={!isAuthenticated}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L22 10z" fill="currentColor"/>
            </svg>
            <span className="comment-action-counter">{c.likeCount || 0}</span>
          </button>
          <button
            type="button"
            className="comment-action-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggleDislike(c.id)}
            aria-pressed={!!c.isDislikeActive}
            title={c.isDislikeActive ? 'Убрать дизлайк' : 'Поставить дизлайк'}
            style={{ color: c.isDislikeActive ? '#1E90FF' : undefined }}
            disabled={!isAuthenticated}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22L1.14 11.27c-.09.23-.14.47-.14.73v1.91C1 15.9 1.9 16.8 3 16.8h6l-1 4.57c-.05.23-.05.46 0 .68.12.5.49.88.95 1.02.1.03.21.05.31.05.38 0 .74-.15 1.02-.43L17 18.8c.38-.38.59-.89.59-1.41V5c0-1.1-.9-2-2-2zm4 0h-2v12h2V3z" fill="currentColor"/>
            </svg>
            <span className="comment-action-counter">{c.dislikeCount || 0}</span>
          </button>
          {isOwnComment?.(c) && (
            <>
              {editingComment === c.id ? (
                <>
                  <button type="button" className="comment-action-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => handleEditComment(c.id, editText)} title="Сохранить">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button type="button" className="comment-action-btn" onMouseDown={(e) => e.preventDefault()} onClick={cancelEditing} title="Отменить">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                    </svg>
                  </button>
                </>
              ) : (
                <button type="button" className="comment-action-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => startEditing(c)} title="Редактировать">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                </button>
              )}
              <button type="button" className="comment-action-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => onDelete?.(c.id)} title="Удалить">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" fill="currentColor"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem


