import { observer } from 'mobx-react-lite'
import { useState, useCallback } from 'react'
import { useStore } from '../../stores/StoreContext'
import UsersListModal from './UsersListModal'
import SubscribeButton from './SubscribeButton'
import { getFriends, getFollowers, getFollowing } from '../../services/userService'
import { useProfileModal } from '../../contexts/ProfileModalContext'

const MyProfileInfo = observer(() => {
  const { profile, myHistories } = useStore()
  const { openProfileModal } = useProfileModal()
  const [modal, setModal] = useState({ open: false, title: '', loading: false, error: null, users: [] })

  const openModal = useCallback(async (type) => {
    const myId = profile.user?.user_info?.id || profile.user?.id
    if (!myId) return
    const title = type === 'friends' ? 'Друзья' : type === 'followers' ? 'Подписчики' : 'Подписки'
    setModal({ open: true, title, loading: true, error: null, users: [] })
    try {
      const users = type === 'friends' ? await getFriends(myId) : type === 'followers' ? await getFollowers(myId) : await getFollowing(myId)
      setModal({ open: true, title, loading: false, error: null, users })
    } catch (e) {
      setModal({ open: true, title, loading: false, error: e.message, users: [] })
    }
  }, [profile.user])

  const closeModal = useCallback(() => setModal(m => ({ ...m, open: false })), [])
  const user = profile.user

  if (!user) return null

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
          <span className="stat-number">{myHistories.items.length}</span>
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
              onCountersUpdate={(followersDelta, followingDelta) => {
                profile.updateUserCounters(followersDelta, followingDelta)
              }}
              onMyCountersUpdate={(followersDelta, followingDelta) => {
                profile.updateUserCounters(followersDelta, followingDelta)
              }}
            />
          )
        }}
      />
    </div>
  )
})

export default MyProfileInfo
