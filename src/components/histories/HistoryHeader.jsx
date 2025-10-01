import { useProfile } from '../../hooks/useProfile'
import { useProfileModal } from '../../contexts/ProfileModalContext'
import Avatar from '../ui/Avatar'
import HistoryActionsDropdown from './HistoryActionsDropdown'
import FavoriteButton from './FavoriteButton'

const HistoryHeader = ({ 
  history, 
  forceMeAsAuthor = false, 
  overrideAuthor, 
  onEdit, 
  onDelete, 
  onEditAttachments,
  isDeleting = false, 
  isOwner = false 
}) => {
  const { getAuthorInfo } = useProfile()
  const { openProfileModal } = useProfileModal()

  if (!history) {
    return null
  }
  
  const { displayLogin, displayAvatar, targetUserId } = getAuthorInfo(history, {
    forceMeAsAuthor,
    overrideAuthorId: overrideAuthor?.id,
    overrideAuthorLogin: overrideAuthor?.login,
    overrideAuthorAvatar: overrideAuthor?.avatar,
  })

  const handleAuthorClick = (e) => {
    e.stopPropagation()
    openProfileModal(targetUserId)
  }

  return (
    <>
      <div className="history-card-author-top">
        <div
          className="history-card-author-left"
          style={{ cursor: targetUserId ? 'pointer' : 'default' }}
          onClick={targetUserId ? handleAuthorClick : undefined}
          title={targetUserId ? 'Показать профиль автора' : ''}
        >
          <Avatar
            avatarUrl={displayAvatar}
            size={40}
            alt={displayLogin}
            className="author-avatar-top"
          />
          <span className="author-login-top">{displayLogin}</span>
        </div>
        <div className="history-card-actions-top">
          <FavoriteButton historyId={history.id} />
          <HistoryActionsDropdown
            onEdit={onEdit}
            onDelete={onDelete}
            onEditAttachments={onEditAttachments}
            history={history}
            isDeleting={isDeleting}
            isOwner={isOwner}
          />
        </div>
      </div>
      <div className="history-title-row">
        <span className="history-title-text">{history.title}</span>
      </div>
    </>
  )
}

export default HistoryHeader 
