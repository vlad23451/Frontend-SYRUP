/**
 * @fileoverview Модальное окно со списком заблокированных пользователей
 */

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useUserBlocks } from '../../hooks/useUserBlocks'
import ModalHeader from '../ui/ModalHeader'
import Avatar from '../ui/Avatar'
import LoadingSpinner from '../ui/LoadingSpinner'

const BlockedUsersModal = ({ 
  isOpen, 
  onClose 
}) => {
  const containerRef = useRef(null)
  const { 
    blockedUsers, 
    loading, 
    error, 
    loadBlockedUsers, 
    unblockUserAction,
    clearError 
  } = useUserBlocks()
  
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

  const handleBackdropClick = useCallback((e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) {
      onClose && onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', onEsc)
    // lock scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      loadBlockedUsers(0, limit)
    }
  }, [isOpen, loadBlockedUsers])

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    loadBlockedUsers(nextPage * limit, limit).then(result => {
      if (result.success) {
        setCurrentPage(nextPage)
        if (!result.data || result.data.length < limit) {
          setHasMore(false)
        }
      }
    })
  }

  const handleUnblockUser = async (userId, username) => {
    if (window.confirm(`Вы уверены, что хотите разблокировать пользователя ${username}?`)) {
      const result = await unblockUserAction(userId)
      if (result.success) {
        // Пользователь уже удален из списка в хуке
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdropClick}>
      <div className="custom-modal blocked-users-modal" ref={containerRef}>
        <ModalHeader title="Заблокированные пользователи" onClose={onClose} />
        
        <div className="blocked-users-modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={clearError}>Закрыть</button>
            </div>
          )}

          {loading && (!Array.isArray(blockedUsers) || blockedUsers.length === 0) ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : !Array.isArray(blockedUsers) || blockedUsers.length === 0 ? (
            <div className="empty-state">
              <p>У вас нет заблокированных пользователей</p>
            </div>
          ) : (
            <div className="blocked-users-list">
              {Array.isArray(blockedUsers) && blockedUsers.map((block) => (
                <div key={block.id} className="blocked-user-card">
                  <div className="blocked-user-info">
                    <Avatar
                      avatarUrl={block.blocked?.avatar_url}
                      size={40}
                      alt={block.blocked?.login}
                      className="blocked-user-avatar"
                    />
                    <div className="blocked-user-details">
                      <h4>{block.blocked?.login || 'Неизвестный пользователь'}</h4>
                      <p className="blocked-date">
                        Заблокирован: {formatDate(block.created_at)}
                      </p>
                      {block.reason && (
                        <p className="block-reason">
                          Причина: {block.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="blocked-user-actions">
                    <button
                      className="unblock-btn"
                      onClick={() => handleUnblockUser(block.blocked?.id, block.blocked?.login)}
                      disabled={loading}
                    >
                      Разблокировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && Array.isArray(blockedUsers) && blockedUsers.length > 0 && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlockedUsersModal
