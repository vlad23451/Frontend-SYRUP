import React, { useRef, useState } from 'react'
import { updateAvatar } from '../../services/userService'

const defaultAvatar = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#e0e0e0"/>
    <path d="M32 34c6.627 0 12-5.373 12-12S38.627 10 32 10 20 15.373 20 22s5.373 12 12 12zm0 4c-8.837 0-16 4.03-16 9v3h32v-3c0-4.97-7.163-9-16-9z" fill="#bdbdbd"/>
  </svg>
)

const ProfileAvatar = ({ user, isMe, onAvatarUpdated }) => {
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        setLoading(true)
        try {
          await updateAvatar(reader.result)
          if (onAvatarUpdated) onAvatarUpdated()
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="profile-avatar" style={{ position: 'relative' }}>
      {user && user.avatar_url
        ? <img src={user.avatar_url} alt="avatar" className="profile-avatar-img" width={80} height={80} style={{ borderRadius: '50%' }} />
        : defaultAvatar
      }
      {isMe && false && (
        <>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading}
          />
          <button
            type="button"
            className="profile-avatar-upload-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={loading}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
            title="Загрузить аватар"
          >
            {loading ? 'Загрузка...' : '✏️'}
          </button>
        </>
      )}
    </div>
  )
}

export default ProfileAvatar 
