/**
 * @fileoverview Компонент выпадающего меню для действий с историей
 * 
 * Специализированный компонент для отображения действий с историей
 * (редактирование, удаление) в виде выпадающего меню.
 * 
 * @param {Object} props - свойства компонента
 * @param {Function} props.onEdit - обработчик редактирования
 * @param {Function} props.onDelete - обработчик удаления
 * @param {boolean} props.isDeleting - состояние удаления
 * @param {boolean} props.isOwner - является ли пользователь владельцем
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React from 'react'
import DropdownMenu from '../common/DropdownMenu'
import ThreeDotsButton from '../common/ThreeDotsButton'
import { useToast } from '../../contexts/ToastContext'

const HistoryActionsDropdown = ({ 
  onEdit, 
  onDelete, 
  onEditAttachments,
  history,
  isDeleting = false, 
  isOwner = false 
}) => {
  const { success, error } = useToast()
  
  const handleShare = async () => {
    const historyUrl = `${window.location.origin}/history/${history.id}`
    
    try {
      await navigator.clipboard.writeText(historyUrl)
      success('Ссылка скопирована в буфер обмена!')
    } catch (err) {
      console.error('Ошибка копирования в буфер:', err)
      error('Не удалось скопировать ссылку')
    }
  }
  const menuItems = [
    // Кнопка "Поделиться" доступна всем пользователям
    {
      text: 'Поделиться',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
      onClick: handleShare
    },
    // Кнопки редактирования только для владельцев
    ...(isOwner ? [
      {
        text: 'Редактировать',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        ),
        onClick: onEdit
      },
      // Показываем кнопку редактирования вложений только если есть вложения
      ...(history.attached_files && history.attached_files.length > 0 ? [{
        text: `Редактировать вложения (${history.attached_files.length})`,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
          </svg>
        ),
        onClick: onEditAttachments
      }] : []),
      {
        text: isDeleting ? 'Удаление...' : 'Удалить',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        ),
        onClick: onDelete,
        disabled: isDeleting,
        className: isDeleting ? 'dropdown-menu-item-disabled' : ''
      }
    ] : [])
  ]

  // Показываем меню всем пользователям (есть хотя бы кнопка "Поделиться")
  return (
    <DropdownMenu
      trigger={<ThreeDotsButton />}
      items={menuItems}
      triggerClassName="history-actions-trigger"
      menuClassName="history-actions-menu"
    />
  )
}

export default HistoryActionsDropdown
