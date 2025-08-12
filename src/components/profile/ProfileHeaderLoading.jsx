import React from 'react'

const ProfileHeaderLoading = () => {
  return (
    <div className="profile-header">
      <div className="text-center">
        <div className="loading loading-lg"></div>
        <p className="text-secondary mt-3">Загрузка профиля...</p>
      </div>
    </div>
  )
}

export default ProfileHeaderLoading 
