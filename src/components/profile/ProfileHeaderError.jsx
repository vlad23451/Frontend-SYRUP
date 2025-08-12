import React from 'react'

const ProfileHeaderError = ({ error }) => {
  return (
    <div className="profile-header">
      <div className="alert alert-danger">
        <strong>Ошибка:</strong> {error}
      </div>
    </div>
  )
}

export default ProfileHeaderError 
