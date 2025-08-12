import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'
import ProfileAvatar from '../components/profile/ProfileAvatar'
import UserProfileInfo from '../components/profile/UserProfileInfo'
import HistoryCard from '../components/histories/HistoryCard'
import SubscribeButton from '../components/profile/SubscribeButton'

const UserProfile = observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userProfile, auth } = useStore()

  useEffect(() => {
    if (id) {
      userProfile.fetchUser(id)
      userProfile.fetchUserHistories(id)
    }
  }, [id, userProfile])

  if (userProfile.loading) {
    return <div className="profile-page"><div className="profile-container">Загрузка...</div></div>
  }
  if (userProfile.error) {
    return <div className="profile-page"><div className="profile-container">Ошибка: {userProfile.error}</div></div>
  }

  const user = userProfile.user

  return (
    <div className="page-container">
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
              <ProfileAvatar user={user} isMe={false} />
            </div>
            <UserProfileInfo user={user} />
            <div className="profile-actions" style={{ display:'flex', gap: 12, justifyContent:'center', marginTop: 12 }}>
              <button className="custom-modal-btn" onClick={() => navigate('/messenger')}>
                Перейти в чат
              </button>
              {user?.user_info?.follow_status !== 'me' && (auth?.user?.id !== (user?.user_info?.id || user?.id)) && (
                <SubscribeButton
                  FollowStatus={user?.user_info?.follow_status}
                  targetId={user?.user_info?.id || user?.id}
                />
              )}
            </div>
          </div>
          <div className="profile-content">
            <div className="user-histories">
              <div className="user-histories-header">
                <h3 className="text-primary">📰 Истории пользователя</h3>
              </div>
              {userProfile.historiesLoading ? (
                <div>Загрузка историй...</div>
              ) : userProfile.historiesError ? (
                <div>Ошибка: {userProfile.historiesError}</div>
              ) : userProfile.histories.length === 0 ? (
                <div className="empty-state">
                  <h4 className="empty-state-title">Нет историй</h4>
                  <p className="empty-state-text">Пользователь ещё не опубликовал истории...</p>
                </div>
              ) : (
                <div className="histories-list">
                  {userProfile.histories.map(h => (
                    <HistoryCard 
                      key={h.id} 
                      history={h}
                      overrideAuthor={{
                        id: user?.user_info?.id || user?.id,
                        login: user?.user_info?.login || user?.login,
                        avatar: user?.avatar_url || user?.avatar,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default UserProfile
