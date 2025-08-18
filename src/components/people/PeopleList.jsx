import './PeopleList.css'
import React, { useEffect, useState, useCallback } from 'react'
import { searchUsers, getFriends, getFollowers } from '../../services/userService'
import { getUserById } from '../../services/userService'
import SubscribeButton from '../profile/SubscribeButton'
import ProfileModal from '../profile/ProfileModal'
import { useNavigate } from 'react-router-dom'
import Avatar from '../ui/Avatar'

const PeopleList = ({ tab, search, userId }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [profileModal, setProfileModal] = useState({ open: false, user: null, loading: false, error: null })
  const navigate = useNavigate()

  const handleCloseModal = useCallback(() => {
    setProfileModal({ open: false, user: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    let ignore = false
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        let data
        if (tab === 'friends') {
          const id = userId || localStorage.getItem('user_id')
          data = await getFriends(id)
        } else if (tab === 'followers') {
          const id = userId || localStorage.getItem('user_id')
          data = await getFollowers(id)
        } else {
          data = await searchUsers(search)
        }
        if (!ignore) setUsers(data)
      } catch (e) {
        if (!ignore) setError(e.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchUsers()
    return () => { ignore = true }
  }, [search, tab, userId])

  useEffect(() => {
    if (!profileModal.open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [profileModal.open, handleCloseModal])

  let filtered = users

  if (loading) return <div>Загрузка...</div>
  if (error) return <div style={{color: 'red'}}>Ошибка: {error}</div>
  if (filtered.length === 0) return <div>Пользователи не найдены.</div>

  const handleOpenProfile = async (user) => {
    setProfileModal({ open: true, user: null, loading: true, error: null })
    try {
      const userData = await getUserById(user.id)
      setProfileModal({ open: true, user: userData, loading: false, error: null })
    } catch (e) {
      setProfileModal({ open: true, user: null, loading: false, error: e.message })
    }
  }

  const handleGoToChat = () => {
    navigate('/messenger')
    handleCloseModal()
  }

  return (
    <>
      <div className="people-list">
        {filtered.map(user => (
          <div key={user.id} className="people-list-item" onClick={() => handleOpenProfile(user)} style={{cursor: 'pointer'}}>
            <Avatar
              avatarKey={user.avatar_key}
              userId={user.id}
              isMyAvatar={false}
              size={56}
              alt={user.login}
              className="people-list-avatar"
            />
            <div className="people-list-info">
              <span className="people-list-login">{user.login}</span>
              {user.name && <span className="people-list-name">{user.name}</span>}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <SubscribeButton
                FollowStatus={user.user_info?.follow_status || user.follow_status}
                targetId={user.user_info?.id || user.id}
              />
            </div>
          </div>
        ))}
      </div>
      <ProfileModal 
        open={profileModal.open}
        user={profileModal.user}
        loading={profileModal.loading}
        error={profileModal.error}
        onClose={handleCloseModal}
        onGoToChat={handleGoToChat}
        onGoToProfile={() => {
          const id = profileModal.user?.user_info?.id || profileModal.user?.id
          if (id) {
            navigate(`/profile/${encodeURIComponent(id)}`)
            handleCloseModal()
          }
        }}
      />
    </>
  )
}

export default PeopleList
