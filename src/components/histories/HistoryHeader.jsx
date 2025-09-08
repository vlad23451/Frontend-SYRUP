import { useProfile } from '../../hooks/useProfile'
import { useProfileModal } from '../../contexts/ProfileModalContext'

const HistoryHeader = ({ history, forceMeAsAuthor = false, overrideAuthor }) => {
  const { getAuthorInfo } = useProfile()
  const { openProfileModal } = useProfileModal()
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
          <img
            src={displayAvatar}
            alt={displayLogin}
            className="author-avatar-top"
          />
          <span className="author-login-top">{displayLogin}</span>
        </div>
      </div>
      <div className="history-title-row">
        <span className="history-title-text">{history.title}</span>
      </div>
    </>
  )
}

export default HistoryHeader 
