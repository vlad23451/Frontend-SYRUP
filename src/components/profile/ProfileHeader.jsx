/**
 * @fileoverview Заголовок профиля пользователя
 * 
 * Этот компонент представляет заголовок страницы профиля с информацией о пользователе.
 * Обрабатывает состояния загрузки и ошибок, отображает аватар и основную информацию.
 * 
 * Функциональность:
 * - Получение данных пользователя через useProfileInfo
 * - Отображение состояния загрузки
 * - Обработка ошибок загрузки данных
 * - Отображение аватара пользователя
 * - Отображение основной информации о пользователе
 * 
 * Состояния:
 * - loading: отображение компонента загрузки
 * - error: отображение компонента ошибки
 * - user: данные пользователя для отображения
 * 
 * Компоненты:
 * - ProfileHeaderLoading: индикатор загрузки
 * - ProfileHeaderError: отображение ошибки
 * - ProfileAvatar: аватар пользователя
 * - ProfileInfo: основная информация о пользователе
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { useCallback, useEffect, useState } from "react"
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'
import ProfileHeaderLoading from "./ProfileHeaderLoading"
import ProfileHeaderError from "./ProfileHeaderError"
import ProfileAvatar from "./ProfileAvatar"
import MyProfileInfo from "./MyProfileInfo"

const ProfileHeader = observer(() => {
  const { profile } = useStore()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAvatarUpdated = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  useEffect(() => {
    profile.fetchProfile()
  }, [profile, refreshKey])

  if (profile.loading) {
    return <ProfileHeaderLoading />
  }

  if (profile.error) {
    return <ProfileHeaderError error={profile.error} />
  }

  return (
    <div className="profile-header">
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
        <ProfileAvatar user={profile.user} isMe={true} onAvatarUpdated={handleAvatarUpdated} />
      </div>
      <MyProfileInfo />
    </div>
  )
})

export default ProfileHeader 
