import { observer } from 'mobx-react-lite'

const ProfileInfo = observer(({ user }) => {
  if (!user) return null
  console.log(user)
  return (
    <div className="profile-info">
      <h2 className="profile-name">{user.user_info.login}</h2>
      <p className="profile-email">@{user.user_info.login}</p>
      <p className="profile-description">{user.user_info.about || 'Описание отсутствует'}</p>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{user.friends}</span>
          <span className="stat-label">Друзья</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.histories}</span>
          <span className="stat-label">Истории</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.followers}</span>
          <span className="stat-label">Подписчики</span>
        </div>
      </div>
    </div>
  )
})

export default ProfileInfo
