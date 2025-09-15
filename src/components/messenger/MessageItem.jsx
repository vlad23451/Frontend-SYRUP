import React, { useState, useRef, useEffect } from 'react'
import { formatMessageDateParts } from '../../utils/dateUtils'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const MessageItem = ({ message, isOwn, index, onReply, onEdit, onEditById, onDelete, onDeleteById, onCopy, onPin, onForward, onSelect, selected }) => {
  const { text, file, time, timestamp, edited_at } = message
  // Используем updated_at если есть (для отредактированных сообщений), иначе timestamp или time
  const messageTime = edited_at || timestamp || time
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text || '')
  const menuRef = useRef(null)
  const messageRef = useRef(null)
  const editInputRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    window.addEventListener('mousedown', onDocClick)
    return () => window.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    if (!menuOpen || !menuRef.current || !messageRef.current) return

    const positionMenu = () => {
      const menu = menuRef.current
      const message = messageRef.current
      const container = message.closest('.messages-container')
      
      if (!menu || !message || !container) return

      // Сначала показываем меню в стандартной позиции для расчета размеров
      menu.style.visibility = 'hidden'
      menu.style.display = 'block'
      
      const menuRect = menu.getBoundingClientRect()
      const messageRect = message.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      let top = -4
      let right = -4
      let left = 'auto'
      
      // Проверяем, помещается ли меню снизу в контейнере
      const spaceBelowInContainer = containerRect.bottom - messageRect.bottom
      const spaceAboveInContainer = messageRect.top - containerRect.top
      const menuHeight = menuRect.height || 200
      
      // Проверяем, помещается ли меню снизу в viewport
      const spaceBelowInViewport = viewportHeight - messageRect.bottom
      const spaceAboveInViewport = messageRect.top
      
      // Если не помещается снизу ни в контейнере, ни в viewport, показываем сверху
      if ((spaceBelowInContainer < menuHeight || spaceBelowInViewport < menuHeight) && 
          spaceAboveInContainer > menuHeight && spaceAboveInViewport > menuHeight) {
        top = -(menuHeight + 8)
      }
      
      // Горизонтальное позиционирование
      if (isOwn) {
        // Для собственных сообщений - всегда слева от сообщения
        right = 'auto'
        left = -4
      } else {
        // Для чужих сообщений - всегда справа от сообщения
        right = -4
        left = 'auto'
      }
      
      setMenuPosition({ top, right, left })
      
      // Показываем меню после позиционирования
      menu.style.visibility = 'visible'
    }

    // Небольшая задержка для корректного расчета размеров
    const timeoutId = setTimeout(positionMenu, 0)
    
    // Добавляем обработчик изменения размера окна
    const handleResize = () => {
      if (menuOpen) {
        positionMenu()
      }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize, true)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
    }
  }, [menuOpen, isOwn])

  const handleEditStart = () => {
    setIsEditing(true)
    setEditText(text || '')
    setMenuOpen(false)
  }

  const handleEditSave = () => {
    if (editText.trim() && editText !== text) {
      if (onEditById && message.id) {
        onEditById(message.id, editText.trim())
      } else {
        onEdit?.(index, editText.trim())
      }
    }
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditText(text || '')
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleEditCancel()
    }
  }
  return (
      <div 
        ref={messageRef}
        id={message.id} 
        data-time={messageTime}
        className={`message-item ${isOwn ? 'own' : ''} ${selected ? 'selected' : ''}`} 
        onClick={(e) => { if (selected !== undefined) onSelect?.(index, message) }}
      >
      <div className="message-content" style={{ position: 'relative' }}>
        {message.replyTo && (
          <div className="message-reply">
            <div className="message-reply-user">{message.replyTo.user}</div>
            <div className="message-reply-text">{(message.replyTo.text || '').slice(0, 160)}</div>
          </div>
        )}
        <div className="message-text">
          {isEditing ? (
            <div className="message-edit-container">
              <textarea
                ref={editInputRef}
                className="message-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                rows={Math.max(1, editText.split('\n').length)}
                placeholder="Введите текст сообщения..."
              />
              <div className="message-edit-actions">
                <button 
                  className="message-edit-btn message-edit-save" 
                  onClick={handleEditSave}
                  title="Сохранить (Enter)"
                >
                  ✓
                </button>
                <button 
                  className="message-edit-btn message-edit-cancel" 
                  onClick={handleEditCancel}
                  title="Отменить (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <>
              {text}
              {file && (
                <div className="message-file">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
                    📎 {file.name}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
        <button
          type="button"
          className={`msg-action-dots ${menuOpen ? 'open' : ''}`}
          title="Действия"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup
          aria-expanded={menuOpen}
        >
          •••
        </button>
        {menuOpen && (
          <div 
            className="msg-action-menu" 
            ref={menuRef}
            style={{
              top: menuPosition.top !== undefined ? menuPosition.top : -4,
              right: menuPosition.right !== undefined ? menuPosition.right : -4,
              left: menuPosition.left !== undefined ? menuPosition.left : 'auto'
            }}
          >
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onReply?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
              </span>
              Ответить
            </button>
            {isOwn && (
              <button className="msg-action-item" onClick={() => { setMenuOpen(false); handleEditStart() }}>
                <span className="msg-action-ico" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </span>
                Изменить
              </button>
            )}
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onPin?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M5 7l5 5v4l4-4 5-5z"/></svg>
              </span>
              Закрепить
            </button>
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onCopy?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </span>
              Копировать текст
            </button>
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onForward?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h11"/><path d="M10 6l6 6-6 6"/></svg>
              </span>
              Переслать
            </button>
            {isOwn && (
              <button className="msg-action-item danger" onClick={() => { 
                setMenuOpen(false); 
                if (onDeleteById && message.id) {
                  onDeleteById(message.id);
                } else {
                  onDelete?.(index, message);
                }
              }}>
                <span className="msg-action-ico" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </span>
                Удалить
              </button>
            )}
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onSelect?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M9 12l2 2 4-4"/></svg>
              </span>
              Выделить
            </button>
          </div>
        )}
        <div className="message-time">
          {formatMessageDateParts(messageTime, userTimezone).time}
          {edited_at && (
            <span className="message-edit-indicator" title={`Отредактировано: ${formatMessageDateParts(edited_at, userTimezone).time}`}>
              (ред.)
            </span>
          )}
          {isOwn && (
            <span
              className={`read-status ${message.is_read ? 'read' : 'unread'}`}
              title={message.is_read ? 'Прочитано' : 'Не прочитано'}
              aria-label={message.is_read ? 'Прочитано' : 'Не прочитано'}
            >
              {message.is_read ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="22 8 11 19 6 14"/>
                  </svg>
                </>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
