import React from 'react'
import { formatHistoryDateTime } from '../../utils/dateUtils'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const HistoryPreview = ({ history }) => {
  if (!history) return null
  const author = history?.author || history?.user || history?.user_info || null
  const authorLogin = author?.login || history?.author_login || history?.login || 'Автор'
  const authorAvatar = author?.avatar || author?.avatar_url || history?.author_avatar || null
  return (
    <div className="history-preview">
      <div className="history-preview-author">
        <img
          className="history-preview-avatar"
          src={authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorLogin)}&background=random`}
          alt={authorLogin}
        />
        <div className="history-preview-meta">
          <div className="history-preview-login">{authorLogin}</div>
          {history.created_at && (
            <div className="history-preview-date">
              {formatHistoryDateTime(history.created_at, userTimezone)}
            </div>
          )}
        </div>
      </div>
      {history.title && <div className="history-preview-title">{history.title}</div>}
      {history.description && (
        <div className="history-preview-desc">{history.description}</div>
      )}
      <div className="history-preview-image">
        <img src="https://placehold.co/600x220?text=Image" alt="Заглушка" />
      </div>
    </div>
  )
}

export default HistoryPreview


