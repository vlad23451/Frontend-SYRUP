import React, { useEffect, useCallback, useRef, useState } from 'react'
import ModalHeader from '../ui/ModalHeader'
import UserProfileInfo from './UserProfileInfo'
import SubscribeButton from './SubscribeButton'
import { useStore } from '../../stores/StoreContext'
import Avatar from '../ui/Avatar'
import BlockUserModal from '../modals/BlockUserModal'
import { useUserBlocks } from '../../hooks/useUserBlocks'

const ProfileModal = ({ open, user, loading, error, onClose, onGoToChat, onGoToProfile, onGoToFavorites }) => {
  const containerRef = useRef(null)
  const { profile, auth } = useStore()
  const [showBlockModal, setShowBlockModal] = useState(false)
  const { isUserBlocked } = useUserBlocks()

  const isOwnProfile = user?.user_info?.id && auth.user?.user_info?.id && 
    user.user_info.id === auth.user.user_info.id
  const isBlocked = isUserBlocked(user?.user_info?.id)
  const handleBackdropClick = useCallback((e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) {
      onClose && onClose()
    }
  }, [onClose])

  const handleBlockUser = useCallback(() => {
    setShowBlockModal(true)
  }, [])

  const handleBlockSuccess = useCallback(() => {
    setShowBlockModal(false)
    // Можно добавить уведомление об успешной блокировке
  }, [])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', onEsc)
    // lock scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])


  if (!open) return null

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdropClick}>
      <div className="custom-modal profile-modal" ref={containerRef}>
        <ModalHeader title="Профиль" onClose={onClose} />

        {loading && <div className="modal-loading">Загрузка профиля...</div>}

        {error && <div className="modal-error">Ошибка: {error}</div>}
        
        {user && user.user_info && (
          <>
            <div className="profile-modal-header" style={{justifyContent: 'center'}}>
              <Avatar
                avatarUrl={user.user_info.avatar_url}
                size={160}
                alt={user.login}
                className="profile-modal-avatar"
                style={{
                  border: '4px solid var(--color-border)',
                  backgroundColor: '#f0f0f0'
                }}
              />
            </div>
            <div className="profile-modal-title" style={{textAlign: 'center'}}>
              <h3>{user.login}</h3>
            </div>
            <div className="profile-modal-body">
              <UserProfileInfo 
                user={user} 
                onCountersUpdate={() => {}} 
                onMyCountersUpdate={(followersDelta, followingDelta) => {
                  profile.updateUserCounters(followersDelta, followingDelta)
                }} 
              />
            </div>
            <div className="custom-modal-actions">
              <button className="custom-modal-btn" onClick={onGoToProfile}>Перейти в профиль</button>
              {isOwnProfile ? (
                <button className="custom-modal-btn confirm" onClick={onGoToFavorites}>Перейти в избранное</button>
              ) : (
                <button className="custom-modal-btn confirm" onClick={onGoToChat}>Перейти в чат</button>
              )}
              {user.user_info.follow_status !== 'me' && (
                <SubscribeButton
                  FollowStatus={user.user_info.follow_status}
                  targetId={user.user_info.id}
                  onCountersUpdate={() => {}}
                  onMyCountersUpdate={(followersDelta, followingDelta) => {
                    profile.updateUserCounters(followersDelta, followingDelta)
                  }}
                />
              )}
              {!isOwnProfile && !isBlocked && (
                <button 
                  className="custom-modal-btn danger" 
                  onClick={handleBlockUser}
                >
                  Заблокировать
                </button>
              )}
              {isBlocked && (
                <div className="blocked-user-notice">
                  <span>Пользователь заблокирован</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <BlockUserModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        user={user}
        onBlockSuccess={handleBlockSuccess}
      />
    </div>
  )
}

export default ProfileModal
