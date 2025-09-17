import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import UsersListModal from './UsersListModal'
import SubscribeButton from './SubscribeButton'
import { getFriends, getFollowers, getFollowing } from '../../services/userService'
import { useProfileModal } from '../../contexts/ProfileModalContext'

const UserProfileInfo = observer(({ user, onCountersUpdate, onMyCountersUpdate }) => {
  const { openProfileModal } = useProfileModal()
  const [modal, setModal] = useState({ open: false, title: '', loading: false, error: null, users: [] })

  const openModal = useCallback(async (type) => {
    const uid = user?.user_info?.id || user?.id
    if (!uid) return
    const title = type === 'friends' ? 'Друзья' : type === 'followers' ? 'Подписчики' : 'Подписки'
    setModal({ open: true, title, loading: true, error: null, users: [] })
    try {
      const users = type === 'friends' ? await getFriends(uid) : type === 'followers' ? await getFollowers(uid) : await getFollowing(uid)
      setModal({ open: true, title, loading: false, error: null, users })
    } catch (e) {
      setModal({ open: true, title, loading: false, error: e.message, users: [] })
    }
  }, [user])

  const closeModal = useCallback(() => setModal(m => ({ ...m, open: false })), [])

  if (!user || !user.user_info) return null

  return (
    <div className="profile-info">
      <h2 className="profile-name">{user.user_info.login}</h2>
      <p className="profile-description">{user.user_info.about}</p>
      <div className="profile-stats">
        <button className="stat-item" style={{cursor:'pointer', background:'transparent', border:'1px solid var(--color-border)', borderRadius:'8px', padding:'8px 12px'}} onClick={() => openModal('friends')}>
          <span className="stat-number">{user.friends}</span>
          <span className="stat-label">Друзья</span>
        </button>
        <button className="stat-item" style={{cursor:'pointer', background:'transparent', border:'1px solid var(--color-border)', borderRadius:'8px', padding:'8px 12px'}} onClick={() => openModal('followers')}>
          <span className="stat-number">{user.followers}</span>
          <span className="stat-label">Подписчики</span>
        </button>
        <button className="stat-item" style={{cursor:'pointer', background:'transparent', border:'1px solid var(--color-border)', borderRadius:'8px', padding:'8px 12px'}} onClick={() => openModal('following')}>
          <span className="stat-number">{user.following ?? 0}</span>
          <span className="stat-label">Подписки</span>
        </button>
        <div className="stat-item">
          <span className="stat-number">{user.histories}</span>
          <span className="stat-label">Истории</span>
        </div>
      </div>
      <UsersListModal
        open={modal.open}
        title={modal.title}
        users={modal.users}
        loading={modal.loading}
        error={modal.error}
        onClose={closeModal}
        onUserClick={(u) => {
          const userId = u.user_info?.id || u.id
          closeModal()
          openProfileModal(userId)
        }}
        onActionRender={(u) => {
          const followStatus = u?.user_info?.follow_status || u?.follow_status
          const targetId = u?.user_info?.id || u?.id
          if (followStatus === 'me') return null
          return (
            <SubscribeButton
              FollowStatus={followStatus}
              targetId={targetId}
              onCountersUpdate={onCountersUpdate}
              onMyCountersUpdate={onMyCountersUpdate}
            />
          )
        }}
      />
    </div>
  )
})

export default UserProfileInfo
