import './PeopleList.css'
import React, { useEffect, useState } from 'react'
import { searchUsers, getFriends, getFollowers } from '../../services/userService'
import { getUserId } from '../../utils/localStorageUtils'
import SubscribeButton from '../profile/SubscribeButton'
import { useProfileModal } from '../../contexts/ProfileModalContext'
import Avatar from '../ui/Avatar'

const PeopleList = ({ tab, search, userId }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { openProfileModal } = useProfileModal()

  useEffect(() => {
    let ignore = false
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        let data
        if (tab === 'friends') {
          const id = userId || getUserId()
          data = await getFriends(id)
        } else if (tab === 'followers') {
          const id = userId || getUserId()
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

  let filtered = users

  if (loading) return <div>Загрузка...</div>
  if (error) return <div style={{color: 'red'}}>Ошибка: {error}</div>
  if (filtered.length === 0) return <div>Пользователи не найдены.</div>

  const handleOpenProfile = (user) => {
    openProfileModal(user.id)
  }

  return (
    <>
      <div className="people-list">
        {filtered.map(user => (
          <div key={user.id} className="people-list-item" onClick={() => handleOpenProfile(user)} style={{cursor: 'pointer'}}>
            <Avatar
              avatarUrl={user.avatar_url}
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
    </>
  )
}

export default PeopleList
