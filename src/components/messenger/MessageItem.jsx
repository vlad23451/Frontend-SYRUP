import React, { useState, useRef, useEffect } from 'react'
import { formatMessageDateParts, formatHistoryDateTime } from '../../utils/dateUtils'
import ContextMenu from '../ui/ContextMenu'
import ContextMenuItem from '../ui/ContextMenuItem'
import { useContextMenu } from '../../hooks/useContextMenu'
import MediaPreviewAdapter from './MediaPreviewAdapter'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const MessageItem = ({ message, isOwn, index, onReply, onEdit, onEditById, onDelete, onDeleteById, onCopy, onPin, onForward, onSelect, selected }) => {
  const { text, file, files, attached_files, timestamp, edited_at } = message
  const messageTime = timestamp
  const editTime = edited_at
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text || '')
  const messageRef = useRef(null)
  const editInputRef = useRef(null)
  
  // Контекстное меню
  const menuId = `message-${message.id || index}`
  const { isOpen: contextMenuOpen,
          position: contextMenuPosition,
          openMenu: openContextMenu,
          closeMenu: closeContextMenu
        } = useContextMenu(menuId)

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  const handleEditStart = () => {
    setIsEditing(true)
    setEditText(text || '')
    closeContextMenu()
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

  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openContextMenu(e)
  }

  const handleContextAction = (action) => {
    closeContextMenu()
    action()
  }

  const getAttachedFiles = () => { return attached_files || files || [] }

  return (
      <div 
        ref={messageRef}
        id={message.id}
        data-time={messageTime}
        className={`message-item ${isOwn ? 'own' : ''} ${selected ? 'selected' : ''}`} 
        onClick={(e) => { 
          if (selected !== undefined) {
            onSelect?.(index, message) 
          }
        }}
      >
      <div 
        className="message-content" 
        style={{ position: 'relative' }}
      >
        {message.replyTo && (
          <div className="message-reply">
            <div className="message-reply-user">{message.replyTo.user}</div>
            <div className="message-reply-text">{(message.replyTo.text || '').slice(0, 160)}</div>
          </div>
        )}
        <div 
          className="message-text" 
          onContextMenu={handleContextMenu}
        >
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
              {getAttachedFiles().length > 0 && (
                <div className="message-attachments">
                  <MediaPreviewAdapter attachedFileIds={getAttachedFiles()} />
                </div>
              )}
            </>
          )}
        </div>
        <div 
          className="message-time"
          title={editTime ? `Отправлено: ${formatHistoryDateTime(messageTime, userTimezone)}\nОтредактировано: ${formatHistoryDateTime(editTime, userTimezone)}` : `Отправлено: ${formatHistoryDateTime(messageTime, userTimezone)}`}
        >
          {formatMessageDateParts(messageTime, userTimezone).time}
          {edited_at && (
            <span className="message-edit-indicator">
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
      
      <ContextMenu
        isOpen={contextMenuOpen}
        position={contextMenuPosition}
        onClose={closeContextMenu}
        alignToLeft={isOwn}
      >
        <ContextMenuItem
          onClick={() => handleContextAction(() => onReply?.(index, message))}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 17 4 12 9 7"></polyline>
              <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
            </svg>
          }
        >
          Ответить
        </ContextMenuItem>
        
        {isOwn && (
          <ContextMenuItem
            onClick={() => handleContextAction(handleEditStart)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            }
          >
            Изменить
          </ContextMenuItem>
        )}
        
        <ContextMenuItem
          onClick={() => handleContextAction(() => onPin?.(index, message))}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17v5"/>
              <path d="M5 7l5 5v4l4-4 5-5z"/>
            </svg>
          }
        >
          Закрепить
        </ContextMenuItem>
        
        <ContextMenuItem
          onClick={() => handleContextAction(() => onCopy?.(index, message))}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          }
        >
          Копировать текст
        </ContextMenuItem>
        
        <ContextMenuItem
          onClick={() => handleContextAction(() => onForward?.(index, message))}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h11"/>
              <path d="M10 6l6 6-6 6"/>
            </svg>
          }
        >
          Переслать
        </ContextMenuItem>
        
        <ContextMenuItem separator />
        
        {isOwn && (
          <ContextMenuItem
            onClick={() => handleContextAction(() => {
              if (onDeleteById && message.id) {
                onDeleteById(message.id);
              } else {
                onDelete?.(index, message);
              }
            })}
            danger
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
              </svg>
            }
          >
            Удалить
          </ContextMenuItem>
        )}
        
        <ContextMenuItem
          onClick={() => handleContextAction(() => onSelect?.(index, message))}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          }
        >
          Выделить
        </ContextMenuItem>
      </ContextMenu>
    </div>
  )
}

export default MessageItem
