import React, { useRef, useState } from 'react'
import { uploadAvatar } from '../../services/fileService'
import { useStore } from '../../stores/StoreContext'
import { saveUserToStorage } from '../../utils/localStorageUtils'
import AvatarEditButton from '../ui/AvatarEditButton'

const defaultAvatar = (
  <svg width="120" height="120" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#e0e0e0"/>
    <path d="M32 34c6.627 0 12-5.373 12-12S38.627 10 32 10 20 15.373 20 22s5.373 12 12 12zm0 4c-8.837 0-16 4.03-16 9v3h32v-3c0-4.97-7.163-9-16-9z" fill="#bdbdbd"/>
  </svg>
)

const ProfileAvatar = ({ user, isMe, onAvatarUpdated }) => {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const { auth } = useStore()

  if (!user) return null

  const avatarSrc = user.user_info?.avatar_url

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const response = await uploadAvatar(file)
      
      // Обновляем данные пользователя в сторе и localStorage
      if (response.avatar_url && auth.user) {
        const updatedUser = {
          ...auth.user,
          user_info: {
            ...auth.user.user_info,
            avatar_url: response.avatar_url
          }
        }
        
        auth.setUser(updatedUser)
        saveUserToStorage(updatedUser)
      }

      if (onAvatarUpdated) {
        onAvatarUpdated(response)
      }
    } catch (err) {
      setError(err.message)
      console.error('Ошибка загрузки аватарки:', err)
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div className="profile-avatar" style={{ position: 'relative' }}>
      {avatarSrc ? (
        <img 
          src={avatarSrc} 
          alt="avatar" 
          className="profile-avatar-img" 
          width={120} 
          height={120} 
          style={{ borderRadius: '50%' }} 
          onError={(e) => {
            console.error('Avatar image failed to load:', avatarSrc)
            e.target.style.display = 'none'
          }}
        />
      ) : (
        <div style={{ width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#e0e0e0"/>
            <path d="M32 34c6.627 0 12-5.373 12-12S38.627 10 32 10 20 15.373 20 22s5.373 12 12 12zm0 4c-8.837 0-16 4.03-16 9v3h32v-3c0-4.97-7.163-9-16-9z" fill="#bdbdbd"/>
          </svg>
        </div>
      )}
      {isMe && (
        <>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
          />
          <AvatarEditButton
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
            uploading={uploading}
          />
        </>
      )}
      {error && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            marginTop: '4px',
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center'
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

export default ProfileAvatar 
