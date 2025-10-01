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
  const { userProfile, auth, profile } = useStore()

  useEffect(() => {
    if (id) {
      userProfile.fetchUser(id)
    }
  }, [id])

  // Загружаем истории только после получения данных пользователя
  useEffect(() => {
    if (id && userProfile.user && userProfile.user.user_info?.follow_status !== 'blocked_me') {
      userProfile.fetchUserHistories(id)
    }
  }, [id, userProfile.user])

  if (userProfile.loading) {
    return <div className="profile-page">
              <div className="profile-container">Загрузка...</div>
           </div>
  }

  if (userProfile.error) {
    return <div className="profile-page">
             <div className="profile-container">Ошибка: {userProfile.error}</div>
           </div>
  }

  const user = userProfile.user

  if (!user) {
    return <div className="profile-page">
              <div className="profile-container">Пользователь не найден</div>
           </div>
  }

  return (
    <div className="page-container">
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
              <ProfileAvatar user={user} isMe={false} />
            </div>
            
            <UserProfileInfo 
              user={user} 
              onCountersUpdate={(followersDelta, followingDelta) => {
                userProfile.updateUserCounters(followersDelta, followingDelta)
              }}
              onMyCountersUpdate={(followersDelta, followingDelta) => {
                profile.updateUserCounters(followersDelta, followingDelta)
              }}
            />
            
            {user?.user_info?.follow_status !== 'blocked_me' && (
              <div className="profile-actions" style={{ display:'flex', gap: 12, justifyContent:'center', marginTop: 12 }}>
                <button className="custom-modal-btn" onClick={() => navigate('/messenger')}>
                  Перейти в чат
                </button>

                {user?.user_info?.follow_status !== 'me' && (auth?.user?.id !== (user?.user_info?.id || user?.id)) && (
                  <SubscribeButton
                    FollowStatus={user.user_info.follow_status}
                    targetId={user?.user_info?.id || user?.id}
                    onCountersUpdate={(followersDelta, followingDelta) => {
                      userProfile.updateUserCounters(followersDelta, followingDelta)
                    }}
                    onMyCountersUpdate={(followersDelta, followingDelta) => {
                      profile.updateUserCounters(followersDelta, followingDelta)
                    }}
                  />
                )}
              </div>
            )}

          </div>
          <div className="profile-content">
            <div className="user-histories">

              <div className="user-histories-header">
                <h3 className="text-primary">Истории пользователя</h3>
              </div>
              
              {user?.user_info?.follow_status === 'blocked_me' ? (
                <div className="blocked-state">
                  <div className="blocked-icon">🚫</div>
                  <h4 className="blocked-title">Пользователь заблокировал вас</h4>
                  <p className="blocked-text">Вы не можете просматривать истории этого пользователя</p>
                </div>
              ) : userProfile.historiesLoading ? (
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
                        id: user?.user_info?.id,
                        login: user?.user_info?.login,
                        avatar: user?.avatar_key,
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
