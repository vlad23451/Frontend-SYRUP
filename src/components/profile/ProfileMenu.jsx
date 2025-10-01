/**
 * @fileoverview Меню профиля с дополнительными действиями
 * 
 * Этот компонент предоставляет выпадающее меню с опциями для редактирования профиля.
 * Включает кнопки для редактирования описания и смены пароля.
 * 
 * Функциональность:
 * - Кнопка с тремя точками в правом верхнем углу
 * - Выпадающее меню с опциями редактирования
 * - Интеграция с модальными окнами редактирования
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import DropdownMenu from '../common/DropdownMenu'
import ThreeDotsButton from '../common/ThreeDotsButton'
import EditAboutModal from './EditAboutModal'
import ChangePasswordModal from './ChangePasswordModal'

const ProfileMenu = () => {
  const [editAboutModal, setEditAboutModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const menuItems = [
    {
      text: 'Редактировать описание',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      onClick: () => setEditAboutModal(true)
    },
    {
      text: 'Сменить пароль',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      onClick: () => setChangePasswordModal(true)
    }
  ]

  return (
    <>
      <DropdownMenu
        trigger={<ThreeDotsButton title="Действия с профилем" />}
        items={menuItems}
        className="profile-menu"
        triggerClassName="profile-menu-trigger"
        menuClassName="profile-menu-dropdown"
        placement="bottom-end"
      />
      
      <EditAboutModal
        isOpen={editAboutModal}
        onClose={() => setEditAboutModal(false)}
      />
      
      <ChangePasswordModal
        isOpen={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
      />
    </>
  )
}

export default ProfileMenu
