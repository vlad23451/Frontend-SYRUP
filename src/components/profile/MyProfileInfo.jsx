import { observer } from 'mobx-react-lite'
import { useState, useCallback, useEffect } from 'react'
import { useStore } from '../../stores/StoreContext'
import UsersListModal from './UsersListModal'
import SubscribeButton from './SubscribeButton'
import { getFriends, getFollowers, getFollowing, searchUsersWithFilters } from '../../services/userService'
import { useProfileModal } from '../../contexts/ProfileModalContext'
import BlockedUsersModal from '../modals/BlockedUsersModal'
import { useUserBlocks } from '../../hooks/useUserBlocks'

const MyProfileInfo = observer(() => {
  const { profile, myHistories } = useStore()
  const { openProfileModal } = useProfileModal()
  const { blockedUsers, totalBlocked, loadBlockedUsers } = useUserBlocks()
  const [modal, setModal] = useState({ open: false, title: '', loading: false, error: null, users: [], searchType: null })
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false)

  // Загружаем заблокированных пользователей при входе в профиль
  useEffect(() => {
    loadBlockedUsers(0, 20) // Загружаем первые 20 записей
  }, [loadBlockedUsers])

  const openModal = useCallback(async (type) => {
    const myId = profile.user?.user_info?.id || profile.user?.id
    if (!myId) return
    const title = type === 'friends' ? 'Друзья' : type === 'followers' ? 'Подписчики' : 'Подписки'
    setModal({ open: true, title, loading: true, error: null, users: [], searchType: type })
    try {
      const users = type === 'friends' ? await getFriends(myId) : type === 'followers' ? await getFollowers(myId) : await getFollowing(myId)
      setModal({ open: true, title, loading: false, error: null, users, searchType: type })
    } catch (e) {
      setModal({ open: true, title, loading: false, error: e.message, users: [], searchType: type })
    }
  }, [profile.user])

  const handleSearch = useCallback(async (query, searchType) => {
    if (!query.trim()) {
      // Если поиск пустой, загружаем полный список
      const myId = profile.user?.user_info?.id || profile.user?.id
      if (!myId) return
      setModal(prev => ({ ...prev, loading: true, error: null }))
      try {
        const users = searchType === 'friends' ? await getFriends(myId) : searchType === 'followers' ? await getFollowers(myId) : await getFollowing(myId)
        setModal(prev => ({ ...prev, loading: false, error: null, users }))
      } catch (e) {
        setModal(prev => ({ ...prev, loading: false, error: e.message, users: [] }))
      }
      return
    }

    setModal(prev => ({ ...prev, loading: true, error: null }))
    try {
      const filters = {}
      if (searchType === 'friends') filters.friends = true
      else if (searchType === 'followers') filters.followers = true
      else if (searchType === 'following') filters.following = true
      
      const users = await searchUsersWithFilters(query, filters)
      setModal(prev => ({ ...prev, loading: false, error: null, users }))
    } catch (e) {
      setModal(prev => ({ ...prev, loading: false, error: e.message, users: [] }))
    }
  }, [profile.user])

  const closeModal = useCallback(() => setModal(m => ({ ...m, open: false })), [])
  const user = profile.user

  if (!user) return null

  return (
    <div className="profile-info">
      <h2 className="profile-name">{user.user_info.login}</h2>
      <p className="profile-description">{user.user_info.about || 'Описание отсутствует'}</p>
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
        {totalBlocked > 0 && (
          <button className="stat-item" style={{cursor:'pointer', background:'transparent', border:'1px solid var(--color-border)', borderRadius:'8px', padding:'8px 12px'}} onClick={() => setShowBlockedUsersModal(true)}>
            <span className="stat-number">{totalBlocked}</span>
            <span className="stat-label">Заблокированные</span>
          </button>
        )}
      </div>
      <UsersListModal
        open={modal.open}
        title={modal.title}
        users={modal.users}
        loading={modal.loading}
        error={modal.error}
        onClose={closeModal}
        onSearch={handleSearch}
        searchType={modal.searchType}
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
      <BlockedUsersModal
        isOpen={showBlockedUsersModal}
        onClose={() => setShowBlockedUsersModal(false)}
      />
    </div>
  )
})

export default MyProfileInfo
