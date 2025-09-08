/**
 * @fileoverview Универсальный компонент аватара
 * 
 * Компонент для отображения аватаров пользователей с автоматической загрузкой URL.
 * Поддерживает разные размеры и типы аватаров (свой/чужой).
 * 
 * @param {string} avatarKey - ключ аватара в S3
 * @param {string|number} userId - ID пользователя (для чужих аватаров)
 * @param {boolean} isMyAvatar - флаг, является ли это моим аватаром
 * @param {number} size - размер аватара в пикселях
 * @param {string} alt - альтернативный текст
 * @param {string} className - CSS класс
 */

import React from 'react'
import { useMyAvatarUrl, useUserAvatarUrl } from '../../hooks/useAvatarUrl'

const defaultAvatarSvg = (size) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#e0e0e0"/>
    <path d="M32 34c6.627 0 12-5.373 12-12S38.627 10 32 10 20 15.373 20 22s5.373 12 12 12zm0 4c-8.837 0-16 4.03-16 9v3h32v-3c0-4.97-7.163-9-16-9z" fill="#bdbdbd"/>
  </svg>
)

const Avatar = ({ 
  avatarKey, 
  userId = null, 
  isMyAvatar = false, 
  size = 40, 
  alt = "avatar", 
  className = "",
  style = {}
}) => {
  // Используем соответствующий хук для получения URL аватара
  const { avatarUrl: myAvatarUrl, loading: myAvatarLoading } = useMyAvatarUrl(
    isMyAvatar ? avatarKey : null
  )
  const { avatarUrl: userAvatarUrl, loading: userAvatarLoading } = useUserAvatarUrl(
    !isMyAvatar ? avatarKey : null,
    !isMyAvatar ? userId : null
  )

  const avatarSrc = isMyAvatar ? myAvatarUrl : userAvatarUrl
  const loading = isMyAvatar ? myAvatarLoading : userAvatarLoading

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    ...style
  }

  if (loading) {
    return (
      <div 
        className={`avatar-loading ${className}`}
        style={containerStyle}
      >
        ⏳
      </div>
    )
  }

  if (avatarSrc) {
    return (
      <img 
        src={avatarSrc} 
        alt={alt}
        className={`avatar-img ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          ...style
        }}
        onError={(e) => {
          console.error('Avatar image failed to load:', avatarSrc)
          e.target.style.display = 'none'
        }}
      />
    )
  }

  return (
    <div 
      className={`avatar-default ${className}`}
      style={containerStyle}
    >
      {defaultAvatarSvg(size)}
    </div>
  )
}

export default Avatar
