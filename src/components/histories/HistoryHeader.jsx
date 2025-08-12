import { useProfile } from '../../hooks/profile/useProfile'
import ProfileModal from '../profile/ProfileModal'

const HistoryHeader = ({ history, forceMeAsAuthor = false, overrideAuthor }) => {
  const { profileModal, getAuthorInfo, handleProfileClick, handleCloseProfileModal } = useProfile()
  
  const { displayLogin, displayAvatar, targetUserId } = getAuthorInfo(history, {
    forceMeAsAuthor,
    overrideAuthorId: overrideAuthor?.id,
    overrideAuthorLogin: overrideAuthor?.login,
    overrideAuthorAvatar: overrideAuthor?.avatar,
  })

  const handleAuthorClick = (e) => {
    e.stopPropagation()
    handleProfileClick(targetUserId)
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
        <span className="history-label">Заголовок:</span>
        <span className="history-title-text">{history.title}</span>
      </div>
      <ProfileModal
        open={profileModal.open}
        user={profileModal.user}
        loading={profileModal.loading}
        error={profileModal.error}
        onClose={handleCloseProfileModal}
        onGoToChat={() => { window.location.href = '/messenger' }}
        onGoToProfile={() => {
          const uid = profileModal?.user?.id || profileModal?.user?.user_info?.id
          if (uid) window.location.href = `/profile/${uid}`
        }}
      />
    </>
  )
}

export default HistoryHeader 
