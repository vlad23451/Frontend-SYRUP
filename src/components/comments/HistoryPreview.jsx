import React from 'react'
import { formatHistoryDateTime } from '../../utils/dateUtils'
import Avatar from '../ui/Avatar'
import MediaPreview from '../histories/MediaPreview'
import { useProfileModal } from '../../contexts/ProfileModalContext'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const HistoryPreview = ({ history }) => {
  const { openProfileModal } = useProfileModal()
  if (!history) return null
  
  const author = history?.author || history?.user || history?.user_info || null
  const authorId = author?.id || history?.author_id || null
  const authorLogin = author?.login || history?.author_login || history?.login || 'Автор'
  const rawAvatarKey = author?.avatar || author?.avatar_key || history?.author_avatar || null
  
  console.log('HistoryPreview - author data:', { author, authorId, authorLogin, rawAvatarKey })
  return (
    <div className="history-preview">
      <div className="history-preview-author">
        <div style={{cursor:'pointer'}} onClick={() => { if (authorId) openProfileModal(authorId) }} title="Открыть профиль">
          
          <Avatar
            avatarUrl={rawAvatarKey}
            size={40}
            alt={authorLogin}
            className="history-preview-avatar"
          />

        </div>
        <div className="history-preview-meta">
          <div className="history-preview-login" style={{cursor:'pointer'}} onClick={() => { if (authorId) openProfileModal(authorId) }} title="Открыть профиль">{authorLogin}</div>
          
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
      
      <MediaPreview attachedFiles={history.attached_files || []} />
    </div>
  )
}

export default HistoryPreview


